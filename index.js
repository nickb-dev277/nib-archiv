export default {
  async fetch(request, env) {
    return new Response(
      env.ADMIN_PASSWORD
        ? "SECRET IST DA!"
        : "SECRET FEHLT",
      {
        headers: {
          "content-type": "text/plain; charset=UTF-8"
        }
      }
    );
  }
};
