// Data keys
const ADMIN_KEY = "adminAddress"; // admin
const COMPETITOR_LIST_KEY = "competitorsList"; // Array of competitor addresses

const VALID_THROWS = ["rock", "paper", "scissors"];

// Admin data stuff
const getAdmin = (): Address => {
  const admin: Address | null = Kv.get(ADMIN_KEY);
  return admin || 'tz1fYnicUG7yVYkMw3TaH55mjus2nnbXcs8m' as Address;
};
// Set the admin
const setAdmin = (admin: Address) => {
  Kv.set(ADMIN_KEY, admin);
};

// General data stuff

// Get list of competitors
const getCompetitors = () => {
  const competitors: Array<Address> | null = Kv.get(COMPETITOR_LIST_KEY);
  return competitors || [] as Array<Address>;
}
// Add a competitor to the list
const addCompetitor = (comp: Address) => {
  const competitors: Array<Address> = getCompetitors();
  if (!competitors.includes(comp)) {
    competitors.push(comp);
    Kv.set(COMPETITOR_LIST_KEY, competitors);
  }
}

// Run a game between two competitors
const runGame = async (a: Address, b: Address, rounds: number): Promise<string> => {
  if (rounds < 1) {
    throw "Need a positive integer for the number of rounds";
  }
  // Initiate a game with each competitor
  let lastChoiceA, lastChoiceB;
  let scoreA = 0;
  let scoreB = 0;

  // Iterate for the rounds
  for (let i = 0; i < rounds; i++) {
    // Get the competitors' responses
    // Call A
    const callA = await fetch(
      new Request(`jstz://${a}`, {
        method: "POST",
        // body: JSON.stringify({ message: "hello" }),
      }),
    );
    lastChoiceA = await callA.json();
    // Call B
    const callB = await fetch(
      new Request(`jstz://${b}`, {
        method: "POST",
        // body: JSON.stringify({ message: "hello" }),
      }),
    );
    lastChoiceB = await callB.json();
    if (!VALID_THROWS.includes(lastChoiceA)) {
      throw `${a} is disqualified for an invalid throw`;
    }
    if (!VALID_THROWS.includes(lastChoiceB)) {
      throw `${b} is disqualified for an invalid throw`;
    }
    console.log(lastChoiceA, lastChoiceB);
    // Determine the winner and increment the score
    if (lastChoiceA !== lastChoiceB) {
      if (lastChoiceA === 'rock') {
        if (lastChoiceB === 'paper') {
          scoreB++;
        }
        if (lastChoiceB === 'scissors') {
          scoreA++;
        }
      }
      if (lastChoiceA === 'paper') {
        if (lastChoiceB === 'rock') {
          scoreA++;
        }
        if (lastChoiceB === 'scissors') {
          scoreB++;
        }
      }
      if (lastChoiceA === 'scissors') {
        if (lastChoiceB === 'rock') {
          scoreB++;
        }
        if (lastChoiceB === 'paper') {
          scoreA++;
        }
      }
    }
  }

  // Return result
  if (scoreA === scoreB) {
    // Tie
    // TODO: Store result
    return "The competitors tied";
  } else {
    // Win
    const winner = scoreA > scoreB ? a : b;
    // TODO: Store result
    return `${winner} wins by a score of ${Math.max(scoreA, scoreB)} to ${Math.min(scoreA, scoreB)}`;
  }
}

const handler = async (request: Request): Promise<Response> => {
  // Extract the requester's address and URL path from the request
  const requester = request.headers.get("Referer") as Address;
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  console.log(`${requester} calls ${path}`);

  let responseMessage = "";

  switch (path) {
    case "/setadmin":
      const currentAdmin = getAdmin();
      if (requester === currentAdmin) {
        // TODO verify address
        const { newAdmin } = await request.json();
        console.log('New admin:', newAdmin);
        setAdmin(newAdmin as Address);
      } else {
        throw "Not the admin";
      }
      responseMessage = 'New admin: ' + getAdmin();
      break;

    case "/getadmin":
      responseMessage = getAdmin();
      break;

    case "/getcompetitors":
      responseMessage = getCompetitors().join(',');
      break;

    case "/addcompetitor":
      // TODO verify address
      const { newCompetitor } = await request.json();
      console.log('New competitor:', newCompetitor);
      addCompetitor(newCompetitor);
      responseMessage = "Added.";
      break;

    case "/rungame":
      const { competitors } = await request.json();
      if (competitors.length !== 2) {
        throw("Send two competitors");
      }
      const [a, b] = competitors
      console.log("Playing a game between", a, 'and', b);
      addCompetitor(a);
      addCompetitor(b);
      responseMessage = await runGame(a, b, 3);
      break;

    default:
      responseMessage =
        "Call a path";
      break;
  }

  return new Response(JSON.stringify(responseMessage));
};

export default handler;