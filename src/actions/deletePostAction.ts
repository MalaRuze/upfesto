import { deletePost } from "@/lib/db/posts";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";

export const deletePostAction = async (postId: string) => {
  try {
    const { post } = await deletePost(postId);
    revalidatePath(`/event/${post.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
