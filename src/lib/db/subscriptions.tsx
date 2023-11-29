import prisma from "../../../prisma/client";

export const createSubscription = async (userId: string, eventId: string) => {
  try {
    const subscription = await prisma.subscribtions.create({
      data: {
        userId,
        eventId,
      },
    });
    return { subscription };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating subscription.");
  }
};

export const deleteSubscription = async (userId: string, eventId: string) => {
  try {
    const subscription = await prisma.subscribtions.delete({
      where: {
        userId_eventId: {
          eventId,
          userId,
        },
      },
    });
    return { subscription };
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting subscription.");
  }
};

export const findEventSubscriptions = async (eventId: string) => {
  try {
    const subscriptions = await prisma.subscribtions.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        event: {
          select: {
            title: true,
            dateFrom: true,
            dateTo: true,
            locationAddress: true,
            imageUrl: true,
          },
        }, // Include related User data
      },
    });

    // Map over subscriptions to create an array of user emails
    const subscribedEmails = subscriptions.map(
      (subscription) => subscription.user.email,
    );
    const event = subscriptions[0]?.event;

    return { event, subscribedEmails };
  } catch (error) {
    console.error(error);
    throw new Error("Error finding subscriptions.");
  }
};

export const findUserSubscriptions = async (userId: string) => {
  try {
    const subscriptions = await prisma.subscribtions.findMany({
      where: {
        userId,
      },
    });
    return { subscriptions };
  } catch (error) {
    console.error(error);
    throw new Error("Error finding subscriptions.");
  }
};

export const findSubscriptionById = async (userId: string, eventId: string) => {
  try {
    const subscription = await prisma.subscribtions.findUnique({
      where: {
        userId_eventId: {
          eventId,
          userId,
        },
      },
    });
    return subscription;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding subscription.");
  }
};
