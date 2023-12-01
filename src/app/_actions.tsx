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
import { createPost, deletePost, updatePost } from "@/lib/db/posts";
import {
  createSubscription,
  deleteSubscription,
  findEventSubscriptions,
  findSubscriptionById,
} from "@/lib/db/subscriptions";
import { Resend } from "resend";

type NewPostInputs = z.infer<typeof PostDataSchema>;
type UpdatePostInputs = z.infer<typeof UpdatePostDataSchema>;
type SubscriptionInputs = z.infer<typeof SubscriptionDataSchema>;

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
