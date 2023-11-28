import prisma from "../../prisma/client";
import { z } from "zod";
import { PostDataSchema, UpdatePostDataSchema } from "@/lib/schema";

export const createPost = async (data: z.infer<typeof PostDataSchema>) => {
  try {
    const post = await prisma.posts.create({
      data: {
        eventId: data.eventId,
        message: data.message,
        type: data.type,
      },
    });
    return { post };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating post.");
  }
};

export const updatePost = async (
  data: z.infer<typeof UpdatePostDataSchema>,
) => {
  try {
    const post = await prisma.posts.update({
      where: {
        id: data.id,
      },
      data: {
        message: data.message,
      },
    });
    return { post };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating post.");
  }
};

export const deletePost = async (postId: string) => {
  try {
    const post = await prisma.posts.delete({
      where: {
        id: postId,
      },
    });
    return { post };
  } catch (error) {
    console.log(error);
    console.error(error);
    throw new Error("Error deleting post.");
  }
};

export const getEventPosts = async (eventId: string) => {
  try {
    const posts = await prisma.posts.findMany({
      where: {
        eventId,
      },
    });
    return { posts };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching posts.");
  }
};
