import prisma from "../../prisma/client";

export async function getEventAttendance(eventId: string) {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        eventId,
      },
    });
    return { attendance };
  } catch (error) {
    return { error };
  }
}
