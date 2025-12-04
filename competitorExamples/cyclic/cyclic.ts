const iterate = (): string => {
  const previousThrow = Kv.get("nextThrow") || "rock";
  let nextThrow: string = "paper";
  switch (previousThrow) {
    case "rock":
      nextThrow = "paper";
      break;
    case "paper":
      nextThrow = "scissors";
      break;
    case "scissors":
      nextThrow = "rock";
      break;
  }
  Kv.set("nextThrow", nextThrow);
  return nextThrow;
};

const handler = async (request: Request): Promise<Response> => {
  // const url = new URL(request.url);
  // const path = url.pathname.toLowerCase();
  return new Response(JSON.stringify(iterate()));
}
export default handler;