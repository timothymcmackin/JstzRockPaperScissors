const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  switch(path) {
    case "/newgame":
      return new Response(JSON.stringify("paper"));
      break;

    case "/nextmove":
      return new Response(JSON.stringify("paper"));
      break;

    default:
      return new Response(JSON.stringify("paper"));
      break;
  }

}
export default handler;