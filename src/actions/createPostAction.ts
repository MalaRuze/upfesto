"use server";

import ImportantChangeEmail from "@/emails/ImportantChangeEmail";
import NewPostEmail from "@/emails/NewPostEmail";
import { createPost } from "@/lib/db/posts";
import { findEventSubscriptions } from "@/lib/db/subscriptions";
import { PostDataSchema } from "@/lib/schema";
import { getErrorMessage } from "@/lib/utils";
import { PostTypeEnum } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";

type NewPostInputs = z.infer<typeof PostDataSchema>;

export type EventForEmail = {
  id: string;
  title: string;
  locationAddress: string | null;
  imageUrl: string | null;
  dateFrom: Date;
  dateTo: Date | null;
  host: { fullName: string; profileImageUrl: string };
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
    await sendEmails(subscribedEmails, event, data);
    revalidatePath(`/event/${data.eventId}`);
    return { success: true, post };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

const sendEmails = async (
  subscribedEmails: string[],
  event: EventForEmail,
  data: NewPostInputs,
) => {
  if (subscribedEmails.length > 0 && data.type === PostTypeEnum.MANUAL) {
    await resend.emails.send({
      from: "Upfesto <info@upfesto.com>",
      to: subscribedEmails,
      subject: "New post in " + event.title,
      text: data.message,
      react: NewPostEmail({ event, message: data.message }),
    });
  }
  if (subscribedEmails.length > 0 && data.type === PostTypeEnum.AUTO) {
    await resend.emails.send({
      from: "Upfesto <info@upfesto.com>",
      to: subscribedEmails,
      subject: "Important changes in " + event.title,
      text: data.message,
      react: ImportantChangeEmail({ event, message: data.message }),
    });
  }
};
