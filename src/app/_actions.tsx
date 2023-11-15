"use server";

import prisma from "../../prisma/client";
import { z } from "zod";
import { AttendanceFormDataSchema, NewEventFormDataSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { ResponseEnum } from "@prisma/client";

type NewEventInputs = z.infer<typeof NewEventFormDataSchema>;
type NewAttendanceInputs = z.infer<typeof AttendanceFormDataSchema>;

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
      response: ResponseEnum.YES,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, event };
}

export async function createNewAttendance(data: NewAttendanceInputs) {
  const validation = AttendanceFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  //check if attendance already exists
  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      userId_eventId: {
        eventId: data.eventId,
        userId: data.userId,
      },
    },
  });

  //if attendance exists, update the response
  if (existingAttendance) {
    //if response is undefined, delete the attendance
    if (data.response === undefined) {
      await prisma.attendance.delete({
        where: {
          userId_eventId: {
            eventId: data.eventId,
            userId: data.userId,
          },
        },
      });
      revalidatePath(`/event/${data.eventId}`);
      return { success: true, attendance: null };
    }

    //if response is the same, return the existing attendance
    if (existingAttendance.response === data.response) {
      return { success: true, attendance: existingAttendance };
    }

    //if response is different, update the attendance
    const attendance = await prisma.attendance.update({
      where: {
        userId_eventId: {
          eventId: data.eventId,
          userId: data.userId,
        },
      },
      data: {
        response: data.response,
      },
    });
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, attendance };
  }

  //if attendance does not exist, create it
  if (data.response !== undefined) {
    const attendance = await prisma.attendance.create({
      data: {
        eventId: data.eventId,
        userId: data.userId,
        response: data.response,
      },
    });
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, attendance };
  }
}
