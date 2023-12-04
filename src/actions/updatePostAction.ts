import { UpdatePostDataSchema } from "@/lib/schema";
import { updatePost } from "@/lib/db/posts";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";
import { z } from "zod";

type UpdatePostInputs = z.infer<typeof UpdatePostDataSchema>;

export const updatePostAction = async (data: UpdatePostInputs) => {
  const validation = UpdatePostDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }
  try {
    const { post } = await updatePost({
      id: data.id,
      message: data.message,
      eventId: data.eventId,
    });
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
