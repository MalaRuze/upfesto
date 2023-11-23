"use server";

import { z } from "zod";
import {
  AttendanceFormDataSchema,
  NewEventFormDataSchema,
  UpdateEventFormDataSchema,
} from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { ResponseEnum } from "@prisma/client";
import { addImage, createEvent, deleteImage, updateEvent } from "@/lib/events";
import {
  createAttendance,
  deleteAttendance,
  findAttendanceById,
  updateAttendance,
} from "@/lib/attendance";
import { getErrorMessage } from "@/lib/utils";
import { format } from "date-fns-tz";

type NewEventInputs = z.infer<typeof NewEventFormDataSchema>;
type UpdateEventInputs = z.infer<typeof UpdateEventFormDataSchema>;
type NewAttendanceInputs = z.infer<typeof AttendanceFormDataSchema>;

const timezone = "Europe/Berlin";

export const createEventAction = async (data: NewEventInputs) => {
  const validation = NewEventFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  // format date and time into a single datetime
  const dateFromString = format(data.dateFrom, "yyyy-MM-dd", {
    timeZone: timezone,
  });
  const dateTimeFrom = new Date(`${dateFromString}T${data.timeFrom}`);
  const dateToString = data.dateTo
    ? format(data.dateTo, "yyyy-MM-dd", { timeZone: timezone })
    : undefined;
  const dateTimeTo = dateToString
    ? new Date(`${dateToString}T${data.timeTo}`)
    : undefined;

  try {
    const { event } = await createEvent({
      title: data.title,
      description: data.description,
      locationAddress: data.locationAddress,
      locationLat: data.locationLat?.toString(),
      locationLon: data.locationLon?.toString(),
      imageUrl: data.imageUrl,
      dateFrom: dateTimeFrom,
      dateTo: dateTimeTo ? dateTimeTo : null,
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

export const updateEventAction = async (data: UpdateEventInputs) => {
  const validation = UpdateEventFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  // format date and time into a single datetime
  const dateFromString = format(data.dateFrom, "yyyy-MM-dd", {
    timeZone: timezone,
  });
  const dateTimeFrom = new Date(`${dateFromString}T${data.timeFrom}`);
  const dateToString = data.dateTo
    ? format(data.dateTo, "yyyy-MM-dd", { timeZone: timezone })
    : undefined;
  const dateTimeTo = dateToString
    ? new Date(`${dateToString}T${data.timeTo}`)
    : undefined;

  try {
    const { event } = await updateEvent({
      id: data.id,
      title: data.title,
      description: data.description,
      locationAddress: data.locationAddress,
      locationLat: data.locationLat?.toString(),
      locationLon: data.locationLon?.toString(),
      imageUrl: data.imageUrl,
      dateFrom: dateTimeFrom,
      dateTo: dateTimeTo ? dateTimeTo : null,
      hostId: data.hostId,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/event/${data.id}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const createNewAttendance = async (data: NewAttendanceInputs) => {
  const validation = AttendanceFormDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const existingAttendance = await findAttendanceById(
    data.userId,
    data.eventId,
  );

  // check if attendance exists
  if (existingAttendance.attendance) {
    // delete attendance if response is undefined
    if (data.response === undefined) {
      try {
        await deleteAttendance(data.userId, data.eventId);
        revalidatePath(`/event/${data.eventId}`);
        return { success: true, attendance: null };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    }

    // return existing attendance if response is the same
    if (existingAttendance.attendance.response === data.response) {
      return { success: true, attendance: existingAttendance };
    }

    // update attendance if response is different
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

  // return null attendance if response is undefined
  if (data.response === undefined) {
    return { success: true, attendance: null };
  }

  // create new attendance if response is not undefined
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

export const handleImageUpload = async (eventId: string, imageUrl: string) => {
  //TODO: handle deleting existing image from uploadthing

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

  try {
    const event = await addImage(eventId, imageUrl);
    revalidatePath(`/event/${eventId}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const deleteImageFromEvent = async (eventId: string) => {
  //TODO: handle deleting image from uploadthing
  try {
    const { event } = await deleteImage(eventId);
    revalidatePath(`/event/${eventId}`);
    return { success: true, event };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
