"use server";

import { revalidatePath } from "next/cache";
import { deleteEvent } from "@/lib/db/events";
import { getErrorMessage } from "@/lib/utils";

const deleteEventAction = async (id: string) => {
  try {
    const { event } = await deleteEvent(id);
    revalidatePath(`/event/${id}`);
    revalidatePath(`/dashboard`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export default deleteEventAction;
