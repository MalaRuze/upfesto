"use server";

import { deleteImage } from "@/lib/db/events";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const deleteImageAction = async (eventId: string) => {
  try {
    const { event } = await deleteImage(eventId);
    revalidatePath(`/event/${eventId}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
