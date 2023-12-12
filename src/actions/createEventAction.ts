"use server";

import { createAttendance } from "@/lib/db/attendance";
import { createEvent } from "@/lib/db/events";
import { NewEventFormDataSchema } from "@/lib/schema";
import { getCombinedDateTime, getErrorMessage } from "@/lib/utils";
import { ResponseEnum } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type NewEventInputs = z.infer<typeof NewEventFormDataSchema>;

export const createEventAction = async (data: NewEventInputs) => {
  const validation = NewEventFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  const dateTimeFrom = getCombinedDateTime(data.dateFrom, data.timeFrom);
  const dateTimeTo = data.dateTo
    ? getCombinedDateTime(data.dateTo, data.timeTo)
    : null;

  try {
    const { event } = await createEvent({
      title: data.title,
      description: data.description,
      locationAddress:
        data.locationAddress === "" ? null : data.locationAddress,
      locationLon: data.locationLon?.toString() || null,
      locationLat: data.locationLat?.toString() || null,
      imageUrl: data.imageUrl,
      dateFrom: dateTimeFrom,
      dateTo: dateTimeTo,
      hostId: data.hostId,
    });
    if (event) {
      await createAttendance({
        eventId: event.id,
        userId: data.hostId,
        response: ResponseEnum.YES,
      });
    }
    revalidatePath("/dashboard");
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
