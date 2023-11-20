import { createNextRouteHandler } from "uploadthing/next";

import { imageFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: imageFileRouter,
});
