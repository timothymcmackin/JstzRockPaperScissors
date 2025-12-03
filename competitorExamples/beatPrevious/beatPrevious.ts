// Throw to beat what the opponent did last time

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  switch(path) {
    case "/newgame":
      return new Response(JSON.stringify("paper"));
      break;

    case "/nextmove":
      const { previous } = await request.json();
      let nextMove;
      switch (previous) {
        case "paper":
          nextMove = "scissors";
          break;
        case "rock":
          nextMove = "paper";
          break;
        case "scissors":
          nextMove = "rock";
          break;
        default:
          nextMove = "paper";
          break;
      }

      return new Response(JSON.stringify(nextMove));
      break;

    default:
      return new Response(JSON.stringify("paper"));
      break;
  }

}
export default handler;