"use client";

import { Posts } from "@prisma/client";
import { getFormattedDateTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { deletePostAction } from "@/actions/deletePostAction";
import { useToast } from "@/components/ui/use-toast";
import PostHandlerDialog from "@/app/(routes)/event/[...eventId]/PostHandlerDialog";

type PostCardProps = {
  post: Posts;
  hostFullName?: string;
  hostProfileImageUrl?: string;
};
const PostCard = ({
  post,
  hostFullName,
  hostProfileImageUrl,
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
    <div className="w-full bg-gray-100 flex flex-col p-4 rounded-xl gap-2">
      {/* post header */}
      <div className="w-full flex justify-between">
        <div className="flex gap-2 text-sm items-center">
          {/* user profile image */}
          <img
            src={hostProfileImageUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          {/* user full name with date of post creation */}
          <div className="flex flex-col">
            <span className="font-semibold">{hostFullName}</span>
            <span className="text-xs">
              {post.dateCreated.getTime() === post.dateUpdated.getTime()
                ? getFormattedDateTime(post.dateCreated)
                : getFormattedDateTime(post.dateCreated) +
                  `  (edited ${getFormattedDateTime(post.dateUpdated)} )`}
            </span>
          </div>
        </div>
        {/* more dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="w-5 h-5 m-2" />
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
                    <Pencil className="h-4 w-4 mr-2" />
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
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Delete post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* post message */}
      <span className="bg-white p-2 w-full whitespace-pre-wrap rounded-xl text-sm">
        {post.message}
      </span>
    </div>
  );
};

export default PostCard;
