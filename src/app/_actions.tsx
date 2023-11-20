"use server";

import prisma from "../../prisma/client";
import { z } from "zod";
import {
  AttendanceFormDataSchema,
  NewEventFormDataSchema,
  UpdateEventFormDataSchema,
} from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { ResponseEnum } from "@prisma/client";
import { addImage } from "@/lib/events";
import { utapi } from "@/app/api/uploadthing/core";

type NewEventInputs = z.infer<typeof NewEventFormDataSchema>;
type UpdateEventInputs = z.infer<typeof UpdateEventFormDataSchema>;
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

export async function updateEvent(data: UpdateEventInputs) {
  const validation = UpdateEventFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  const dateFromString = data.dateFrom.toISOString().split("T")[0];
  const dateTimeFrom = new Date(`${dateFromString}T${data.timeFrom}`);
  const dateToString = data.dateTo?.toISOString().split("T")[0];
  const dateTimeTo = dateToString
    ? new Date(`${dateToString}T${data.timeTo}`)
    : undefined;

  const event = await prisma.event.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      imageUrl: data.imageUrl,
      dateFrom: dateTimeFrom,
      dateTo: dateTimeTo ? dateTimeTo : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/event/${data.id}`);
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

export async function handleImageUpload(eventId: string, imageUrl: string) {
  //TODO: handle deleting existing image

  // check if there is an existing image
  // const existingEvent = await prisma.event.findUnique({
  //   where: {
  //     id: eventId,
  //   },
  // });
  //
  // if (existingEvent?.imageUrl) {
  //   //delete existing image from uploadthing
  //   await utapi.deleteFiles(existingEvent.imageUrl);
  // }

  //update event with new image
  try {
    const event = await addImage(eventId, imageUrl);
    revalidatePath(`/event/${eventId}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteImageFromEvent(eventId: string) {
  try {
    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        imageUrl: null,
      },
    });
    revalidatePath(`/event/${eventId}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error };
  }
}
