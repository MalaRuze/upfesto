"use server";

import prisma from "../../prisma/client";
import { z } from "zod";
import { NewEventFormDataSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { Response } from "@prisma/client";

type NewEventInputs = z.infer<typeof NewEventFormDataSchema>;

export async function createNewEvent(data: NewEventInputs) {
  const validation = NewEventFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  const dateFromString = data.dateFrom.toISOString().split("T")[0];
  const dateTimeFrom = new Date(`${dateFromString}T${data.timeFrom}`);
  const dateToString = data.dateTo?.toISOString().split("T")[0];
  const dateTimeTo = dateToString
    ? new Date(`${dateToString}T${data.timeTo}`)
    : undefined;

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      imageUrl: data.imageUrl,
      dateFrom: dateTimeFrom,
      dateTo: dateTimeTo ? dateTimeTo : null,
      hostId: data.hostId,
    },
  });

  await prisma.attendance.create({
    data: {
      eventId: event.id,
      userId: data.hostId,
      response: Response.YES,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, event };
}
