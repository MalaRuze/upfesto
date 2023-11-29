import prisma from "../../../prisma/client";
import { z } from "zod";
import { AttendanceDataSchema, AttendanceFormDataSchema } from "@/lib/schema";

export const getEventAttendance = async (eventId: string) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            fullName: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });
    return { attendance };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching event attendance.");
  }
};

export const createAttendance = async (
  data: z.infer<typeof AttendanceDataSchema>,
) => {
  try {
    const attendance = await prisma.attendance.create({
      data: {
        eventId: data.eventId,
        userId: data.userId,
        response: data.response,
      },
    });
    return { attendance };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating attendance.");
  }
};

export const updateAttendance = async (
  data: z.infer<typeof AttendanceDataSchema>,
) => {
  try {
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
    return { attendance };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating attendance.");
  }
};

export const findAttendanceById = async (userId: string, eventId: string) => {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_eventId: {
          eventId,
          userId,
        },
      },
    });
    return { attendance };
  } catch (error) {
    console.error(error);
    throw new Error("Error finding attendance.");
  }
};

export const deleteAttendance = async (userId: string, eventId: string) => {
  try {
    const attendance = await prisma.attendance.delete({
      where: {
        userId_eventId: {
          eventId,
          userId,
        },
      },
    });
    return { attendance };
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting attendance.");
  }
};

export const deleteAllAttendance = async () => {
  try {
    const attendance = await prisma.attendance.deleteMany();
    return { attendance };
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting attendance.");
  }
};
