"use client";

import { UploadButton } from "@/lib/uploadthing";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import FileUploadSharpIcon from "@mui/icons-material/FileUploadSharp";
import { deleteImageFromEvent, handleImageUpload } from "@/app/_actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import React from "react";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

type UploadImageButtonProps = {
  eventId: string;
  imageUrl: string | null;
};

const UploadImageButton = ({ eventId, imageUrl }: UploadImageButtonProps) => {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-white/80 hover:bg-white/95 p-2 rounded-xl  ">
          <EditSharpIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="px-2">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={async (uploadRes) => {
            try {
              const res = await handleImageUpload(eventId, uploadRes[0].url);
              if (!res) {
                toast({
                  variant: "destructive",
                  title: "Image upload failed",
                  description: `Something went wrong, please try again later.`,
                });
              }
              if (res?.success === false) {
                toast({
                  title: "Something went wrong",
                  description: res.error + " Please try again later.",
                  variant: "destructive",
                });
              }
              toast({
                title: "Image uploaded",
                description: "Your new cover image has been uploaded",
              });
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Image upload failed",
                description: `Something went wrong, please try again later. ${
                  error instanceof Error && error.message
                }`,
              });
            }
          }}
          onUploadError={(error: Error) => {
            toast({
              variant: "destructive",
              title: "Image upload failed",
              description: `Something went wrong, please try again later. Error: ${error.message}`,
            });
          }}
          appearance={{
            allowedContent: "hidden",
            button: "h-5 text-black px-2 py-4 text-sm hover:bg-black/5 w-full",
          }}
          content={{
            button({ ready, isUploading }) {
              if (isUploading) {
                return (
                  <div className="flex gap-3">
                    <Spinner size={3} />
                    <span className="text-black/50"> Uploading</span>
                  </div>
                );
              }
              return ready ? (
                <div>
                  <FileUploadSharpIcon className="mr-1 !h-4 !w-4" />{" "}
                  <span>Upload new image</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Spinner size={3} />
                  <span className="text-black/50"> Loading</span>
                </div>
              );
            },
          }}
        />

        {imageUrl && (
          <DropdownMenuItem
            className="text-destructive"
            onClick={async () => await deleteImageFromEvent(eventId)}
          >
            <DeleteOutlineSharpIcon className="mr-2 !h-4 !w-4" />
            <span>Remove Image</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UploadImageButton;
