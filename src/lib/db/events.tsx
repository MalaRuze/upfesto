import { NewEventDataSchema, UpdateEventDataSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { currentUser } from "@clerk/nextjs";
import { z } from "zod";

export const getUserEvents = async () => {
  const user = await currentUser();
  try {
    const events = await prisma.event.findMany({
      where: {
        hostId: user?.id,
      },
    });

    return { events };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching events.");
  }
};

export const getEventById = async (eventId: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    return { event };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching event.");
  }
};

export const getUserCreatedEvents = async () => {
  const user = await currentUser();
  try {
    const events = await prisma.event.findMany({
      where: {
        hostId: user?.id,
      },
      include: {
        attendances: true,
      },
    });
    return { events };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching events.");
  }
};

export const getuserReactedEvents = async () => {
  const user = await currentUser();
  try {
    const events = await prisma.event.findMany({
      where: {
        NOT: {
          hostId: user?.id,
        },
        attendances: {
          some: {
            userId: user?.id,
          },
        },
      },
      include: {
        attendances: true,
      },
    });
    return { events };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching events.");
  }
};

export const createEvent = async (data: z.infer<typeof NewEventDataSchema>) => {
  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLon: data.locationLon,
        imageUrl: data.imageUrl,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        hostId: data.hostId,
      },
    });
    return { event };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating event.");
  }
};

export const updateEvent = async (
  data: z.infer<typeof UpdateEventDataSchema>,
) => {
  try {
    const event = await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLon: data.locationLon,
        imageUrl: data.imageUrl,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
      },
    });
    return { event };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating event.");
  }
};

export const addImage = async (eventId: string, imageUrl: string) => {
  try {
    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        imageUrl,
      },
    });
    return { event };
  } catch (error) {
    console.error(error);
    throw new Error("Error adding image.");
  }
};

export const deleteImage = async (eventId: string) => {
  try {
    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        imageUrl: null,
      },
    });
    return { event };
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting image.");
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const event = await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
    return { event };
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting event.");
  }
};
