import { generateComponents } from "@uploadthing/react";
import { ImageFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<ImageFileRouter>();
