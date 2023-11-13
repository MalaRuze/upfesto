import prisma from "../../prisma/client";
import { currentUser } from "@clerk/nextjs";

export async function getUserEvents() {
  const user = await currentUser();
  try {
    const events = await prisma.event.findMany({
      where: {
        hostId: user?.id,
      },
    });
    return { events };
  } catch (error) {
    return { error };
  }
}

export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    return { event };
  } catch (error) {
    return { error };
  }
}
