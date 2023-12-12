import { currentUser } from "@clerk/nextjs";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const utapi = new UTApi();

export const imageFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { imageUrl: file.url };
    }),
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
