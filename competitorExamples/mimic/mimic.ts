// Do what the opponent did last time
const defaultThrow = "paper";

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  switch(path) {
    case "/newgame":
      return new Response(JSON.stringify(defaultThrow));
      break;

    case "/nextmove":
      const { previous } = await request.json();
      return new Response(JSON.stringify(previous || defaultThrow));
      break;

    default:
      return new Response(JSON.stringify(defaultThrow));
      break;
  }

}
export default handler;