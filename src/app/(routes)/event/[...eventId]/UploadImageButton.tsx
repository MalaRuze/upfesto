"use client";

import { addImageAction } from "@/actions/addImageAction";
import { deleteImageAction } from "@/actions/deleteImageAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import { ArrowUpFromLine, ImagePlus, Trash2 } from "lucide-react";
import React from "react";

type UploadImageButtonProps = {
  eventId: string;
  imageUrl: string | null;
};

const UploadImageButton = ({ eventId, imageUrl }: UploadImageButtonProps) => {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-xl bg-white/80 p-2 hover:bg-white/95  ">
          <ImagePlus />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="px-2">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={async (uploadRes) => {
            try {
              const res = await addImageAction(eventId, uploadRes[0].url);
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
                <div className="flex items-center gap-2">
                  <ArrowUpFromLine className="h-4 w-4" />
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
            className="flex items-center gap-2 text-destructive"
            onClick={async () => await deleteImageAction(eventId)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove Image</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UploadImageButton;
