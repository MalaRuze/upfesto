"use client";

import { deletePostAction } from "@/actions/deletePostAction";
import PostHandlerDialog from "@/app/(routes)/event/[...eventId]/PostHandlerDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { getFormattedDateTime } from "@/lib/utils";
import { PostTypeEnum, Posts } from "@prisma/client";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import React from "react";

type PostCardProps = {
  post: Posts;
  hostFullName?: string;
  hostProfileImageUrl?: string;
  isHost: boolean;
};
const PostCard = ({
  post,
  hostFullName,
  hostProfileImageUrl,
  isHost,
}: PostCardProps) => {
  const { toast } = useToast();
  const handleDeletePost = async (postId: string) => {
    const res = await deletePostAction(postId);
    if (res?.success === false) {
      toast({
        title: "Something went wrong",
        description: res?.error + " Please try again later.",
        variant: "destructive",
      });
      return;
    }
    if (!res) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Post deleted",
      description: "Your post has been deleted.",
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-gray-100 p-4">
      {/* post header */}
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2 text-sm">
          {/* user profile image */}
          <img
            src={hostProfileImageUrl}
            alt="avatar"
            className="h-8 w-8 rounded-full"
          />
          {/* user full name with date of post creation */}
          <div className="flex flex-col">
            <span className="font-semibold">{hostFullName}</span>
            <span className="text-xs">
              {post.dateCreated.getTime() === post.dateUpdated.getTime()
                ? getFormattedDateTime(post.dateCreated)
                : getFormattedDateTime(post.dateCreated) +
                  `  (edited ${getFormattedDateTime(post.dateUpdated)} )`}
              {post.type === PostTypeEnum.AUTO && " (auto-generated)"}
            </span>
          </div>
        </div>
        {/* more dropdown */}
        {post.type === PostTypeEnum.MANUAL && isHost && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="m-2 h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* edit post */}
              <DropdownMenuItem asChild>
                <PostHandlerDialog
                  mode="update"
                  postId={post.id}
                  message={post.message}
                  eventId={post.eventId}
                  trigger={
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit post</span>
                    </div>
                  }
                />
              </DropdownMenuItem>
              {/* delete post */}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {/* post message */}
      <span className="w-full whitespace-pre-wrap rounded-xl bg-white p-2 text-sm">
        {post.message}
      </span>
    </div>
  );
};

export default PostCard;
