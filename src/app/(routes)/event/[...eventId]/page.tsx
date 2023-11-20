import { getEventById } from "@/lib/events";
import { getEventAttendance } from "@/lib/attendance";
import { ResponseEnum } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";
import ResponseDialog from "@/app/(routes)/event/[...eventId]/ResponseDialog";
import EventHandlerDialog from "@/components/EventHandlerDialog";
import UploadImageButton from "@/app/(routes)/event/[...eventId]/UploadImageButton";
import { Suspense } from "react";

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
    <main className="flex min-h-screen flex-col items-center p-10 ">
      <div className="bg-gradient-to-bl from-indigo-400 to-sky-100  h-64 w-full max-w-5xl rounded-xl relative">
        {event?.imageUrl !== null && (
          <img
            src={event?.imageUrl}
            alt={event?.title}
            className="object-cover h-full w-full rounded-xl"
          />
        )}
        {event && (
          <div className="absolute bottom-2 right-2">
            <UploadImageButton eventId={event.id} imageUrl={event.imageUrl} />
          </div>
        )}
      </div>
      <h1 className="text-3xl py-8">{event?.title}</h1>
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
      {event && (
        <div>
          <ResponseDialog
            currentUserAttendance={currentUserAttendance}
            eventId={event.id}
            userId={user?.id}
          />
          <EventHandlerDialog
            mode="update"
            trigger={<button>Update</button>}
            event={event}
          />
        </div>
      )}
    </main>
  );
};

export default EventPage;
