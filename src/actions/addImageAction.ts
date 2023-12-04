"use server";

import { addImage } from "@/lib/db/events";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";

export const addImageAction = async (eventId: string, imageUrl: string) => {
  try {
    const event = await addImage(eventId, imageUrl);
    revalidatePath(`/event/${eventId}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
