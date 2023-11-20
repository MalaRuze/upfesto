import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const utapi = new UTApi();

// FileRouter for your app, can contain multiple FileRoutes
export const imageFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const user = await currentUser();
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { imageUrl: file.url };
    }),
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
