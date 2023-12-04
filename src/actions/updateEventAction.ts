"use server";

import { UpdateEventFormDataSchema } from "@/lib/schema";
import { getEventById, updateEvent } from "@/lib/db/events";
import { PostTypeEnum } from "@prisma/client";
import {
  getCombinedDateTime,
  getErrorMessage,
  getFormattedDateTime,
} from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { createPostAction } from "@/actions/createPostAction";
import { z } from "zod";

type UpdateEventInputs = z.infer<typeof UpdateEventFormDataSchema>;

export const updateEventAction = async (data: UpdateEventInputs) => {
  const validation = UpdateEventFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  const dateTimeFrom = getCombinedDateTime(data.dateFrom, data.timeFrom);
  const dateTimeTo = data.dateTo
    ? getCombinedDateTime(data.dateTo, data.timeTo)
    : null;

  try {
    const { event: oldEvent } = await getEventById(data.id);
    const { event } = await updateEvent({
      id: data.id,
      title: data.title,
      description: data.description,
      locationAddress: data.locationAddress,
      locationLat: data.locationLat?.toString(),
      locationLon: data.locationLon?.toString(),
      imageUrl: data.imageUrl,
      dateFrom: dateTimeFrom,
      dateTo: dateTimeTo,
      hostId: data.hostId,
    });
    if (oldEvent) {
      const locationChanged = oldEvent.locationAddress !== data.locationAddress;
      const dateChanged =
        oldEvent.dateFrom.getTime() !== dateTimeFrom.getTime();

      if (locationChanged && !dateChanged) {
        await createPostAction({
          eventId: data.id,
          message: `Location was changed to ${data.locationAddress}`,
          type: PostTypeEnum.AUTO,
        });
      }
      if (!locationChanged && dateChanged) {
        await createPostAction({
          eventId: data.id,
          message: `Date was changed to ${getFormattedDateTime(dateTimeFrom)}`,
          type: PostTypeEnum.AUTO,
        });
      }
      if (locationChanged && dateChanged) {
        await createPostAction({
          eventId: data.id,
          message: `Date was changed to ${getFormattedDateTime(
            data.dateFrom,
          )} and location was changed to ${data.locationAddress}`,
          type: PostTypeEnum.AUTO,
        });
      }
    }
    revalidatePath("/dashboard");
    revalidatePath(`/event/${data.id}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
