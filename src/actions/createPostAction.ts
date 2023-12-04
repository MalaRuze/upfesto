"use server";

import { PostDataSchema } from "@/lib/schema";
import { createPost } from "@/lib/db/posts";
import { findEventSubscriptions } from "@/lib/db/subscriptions";
import { PostTypeEnum } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";
import { Resend } from "resend";
import { z } from "zod";

type NewPostInputs = z.infer<typeof PostDataSchema>;

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
    await sendEmails(subscribedEmails, event, data);
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

const sendEmails = async (
  subscribedEmails: string[],
  event: any,
  data: NewPostInputs,
) => {
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
};
