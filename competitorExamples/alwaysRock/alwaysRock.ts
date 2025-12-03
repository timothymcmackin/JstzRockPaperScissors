const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  switch(path) {
    case "/newgame":
      return new Response(JSON.stringify("rock"));
      break;

    case "/nextmove":
      return new Response(JSON.stringify("rock"));
      break;

    default:
      return new Response(JSON.stringify("rock"));
      break;
  }

}
export default handler;