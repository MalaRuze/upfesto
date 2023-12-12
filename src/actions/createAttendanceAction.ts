"use server";

import {
  createAttendance,
  deleteAttendance,
  findAttendanceById,
  updateAttendance,
} from "@/lib/db/attendance";
import { AttendanceFormDataSchema } from "@/lib/schema";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type NewAttendanceInputs = z.infer<typeof AttendanceFormDataSchema>;

export const createAttendanceAction = async (data: NewAttendanceInputs) => {
  const validation = AttendanceFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const existingAttendance = await findAttendanceById(
    data.userId,
    data.eventId,
  );

  if (existingAttendance.attendance) {
    if (data.response === undefined) {
      try {
        await deleteAttendance(data.userId, data.eventId);
        revalidatePath(`/event/${data.eventId}`);
        return { success: true, attendance: null };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    }

    if (existingAttendance.attendance.response === data.response) {
      return { success: true, attendance: existingAttendance };
    }

    try {
      const { attendance } = await updateAttendance({
        eventId: data.eventId,
        userId: data.userId,
        response: data.response,
      });
      revalidatePath(`/event/${data.eventId}`);
      return { success: true, attendance };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  if (data.response === undefined) {
    return { success: true, attendance: null };
  }

  if (data.response) {
    try {
      const attendance = await createAttendance({
        eventId: data.eventId,
        userId: data.userId,
        response: data.response,
      });
      revalidatePath(`/event/${data.eventId}`);
      return { success: true, attendance };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }
};
