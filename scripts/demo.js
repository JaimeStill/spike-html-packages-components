// mise run demo: serves the repository through the browser tier's static server and prints the
// demo page's URL, which loads dist/, until Ctrl-C.
// Adapted from spike-html-packages-foundation (5dd8a58): scripts/demo.js, with the components page
// in place of the tools and keys pages.

import { serve } from "../test/browser/support/server.js";

const server = await serve();
console.log(`${server.origin}/demo/components.html`);
process.once("SIGINT", async () => {
  await server.stop();
  process.exit(0);
});
