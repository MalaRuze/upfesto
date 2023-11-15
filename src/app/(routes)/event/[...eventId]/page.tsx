import { getEventById } from "@/lib/events";
import { getEventAttendance } from "@/lib/attendance";
import { ResponseEnum } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";
import ResponseDialog from "@/app/(routes)/new-event/ResponseDialog";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

const EventPage = async ({ params: { eventId } }: EventPageProps) => {
  const user = await currentUser();
  const { event } = await getEventById(eventId[0]);
  const { attendance } = await getEventAttendance(eventId[0]);
  const yesCount = attendance?.filter((a) => a.response === ResponseEnum.YES);
  const maybeCount = attendance?.filter(
    (a) => a.response === ResponseEnum.MAYBE,
  );
  const noCount = attendance?.filter((a) => a.response === ResponseEnum.NO);
  const currentUserAttendance = attendance?.find((a) => a.userId === user?.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl pb-8">{event?.title}</h1>
      <p>Attendance:</p>
      <div className="grid grid-cols-3">
        <div>
          <p>going</p>
          <div>{yesCount?.length}</div>
        </div>
        <div>
          <p>maybe</p>
          <div>{maybeCount?.length}</div>
        </div>
        <div>
          <p>cant go</p>
          <div>{noCount?.length}</div>
        </div>
      </div>
      {event?.id && (
        <ResponseDialog
          currentUserAttendance={currentUserAttendance}
          eventId={event.id}
          userId={user?.id}
        />
      )}
    </main>
  );
};

export default EventPage;
