import { z } from "zod";
import { SubscriptionDataSchema } from "@/lib/schema";
import {
  createSubscription,
  deleteSubscription,
  findSubscriptionById,
} from "@/lib/db/subscriptions";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";

type SubscriptionInputs = z.infer<typeof SubscriptionDataSchema>;

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
