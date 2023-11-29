"use server";

import { z } from "zod";
import {
  AttendanceFormDataSchema,
  NewEventFormDataSchema,
  PostDataSchema,
  SubscriptionDataSchema,
  UpdateEventFormDataSchema,
  UpdatePostDataSchema,
} from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { PostTypeEnum, ResponseEnum } from "@prisma/client";
import {
  addImage,
  createEvent,
  deleteAllEvents,
  deleteImage,
  getEventById,
  updateEvent,
} from "@/lib/db/events";
import {
  createAttendance,
  deleteAllAttendance,
  deleteAttendance,
  findAttendanceById,
  updateAttendance,
} from "@/lib/db/attendance";
import { getErrorMessage, getFormattedDateTime } from "@/lib/utils";
import { format } from "date-fns-tz";
import { createPost, deletePost, updatePost } from "@/lib/db/posts";
import {
  createSubscription,
  deleteSubscription,
  findEventSubscriptions,
  findSubscriptionById,
} from "@/lib/db/subscriptions";
import { Resend } from "resend";

type NewEventInputs = z.infer<typeof NewEventFormDataSchema>;
type UpdateEventInputs = z.infer<typeof UpdateEventFormDataSchema>;
type NewAttendanceInputs = z.infer<typeof AttendanceFormDataSchema>;
type NewPostInputs = z.infer<typeof PostDataSchema>;
type UpdatePostInputs = z.infer<typeof UpdatePostDataSchema>;
type SubscriptionInputs = z.infer<typeof SubscriptionDataSchema>;

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

  //check if location or dateFrom changed and if so, create post

  try {
    const existingEvent = await getEventById(data.id);
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
    if (
      existingEvent.event &&
      existingEvent.event.locationAddress !== data.locationAddress &&
      existingEvent.event.dateFrom.getTime() === dateTimeFrom.getTime()
    ) {
      await createPostAction({
        eventId: data.id,
        message: `Location was changed to ${data.locationAddress}`,
        type: PostTypeEnum.AUTO,
      });
    }
    if (
      existingEvent.event &&
      existingEvent.event.dateFrom.getTime() !== dateTimeFrom.getTime() &&
      existingEvent.event.locationAddress === data.locationAddress
    ) {
      await createPostAction({
        eventId: data.id,
        message: `Date was changed to ${getFormattedDateTime(data.dateFrom)}`,
        type: PostTypeEnum.AUTO,
      });
    }
    if (
      existingEvent.event &&
      existingEvent.event.dateFrom.getTime() !== dateTimeFrom.getTime() &&
      existingEvent.event.locationAddress !== data.locationAddress
    ) {
      await createPostAction({
        eventId: data.id,
        message: `Date was changed to ${getFormattedDateTime(
          data.dateFrom,
        )} and location was changed to ${data.locationAddress}`,
        type: PostTypeEnum.AUTO,
      });
    }
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

const resend = new Resend(process.env.RESEND_API_KEY);

export const createPostAction = async (data: NewPostInputs) => {
  const validation = PostDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  try {
    const { post } = await createPost({
      eventId: data.eventId,
      message: data.message,
      type: data.type,
    });
    const { event, subscribedEmails } = await findEventSubscriptions(
      data.eventId,
    );
    if (subscribedEmails.length > 0 && data.type === PostTypeEnum.MANUAL) {
      await resend.emails.send({
        from: "Upfesto <info@upfesto.com>",
        to: subscribedEmails,
        subject: "New post in event " + event.title,
        text: data.message,
      });
    }
    if (subscribedEmails.length > 0 && data.type === PostTypeEnum.AUTO) {
      await resend.emails.send({
        from: "Upfesto <info@upfesto.com>",
        to: subscribedEmails,
        subject: "Important changes in " + event.title,
        text: data.message,
      });
    }
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const updatePostAction = async (data: UpdatePostInputs) => {
  const validation = UpdatePostDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }
  try {
    const { post } = await updatePost({
      id: data.id,
      message: data.message,
      eventId: data.eventId,
    });
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const deletePostAction = async (postId: string) => {
  try {
    const { post } = await deletePost(postId);
    revalidatePath(`/event/${post.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const restartPrisma = async () => {
  try {
    await deleteAllAttendance();
    await deleteAllEvents();
  } catch (error) {
    console.log(error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const handleSubscriptionAction = async (data: SubscriptionInputs) => {
  const validation = SubscriptionDataSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors };
  }

  const existingSubscription = await findSubscriptionById(
    data.userId,
    data.eventId,
  );

  if (existingSubscription) {
    try {
      const { subscription } = await deleteSubscription(
        data.userId,
        data.eventId,
      );
      revalidatePath(`/event/${data.eventId}`);
      return { success: true, subscription: null };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  try {
    const { subscription } = await createSubscription(
      data.userId,
      data.eventId,
    );
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, subscription };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
