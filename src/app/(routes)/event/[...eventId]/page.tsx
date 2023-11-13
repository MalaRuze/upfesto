import { useParams } from "next/navigation";
import { getEventById } from "@/lib/events";
import { getEventAttendance } from "@/lib/attendance";
import Response from "@prisma/client";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

const EventPage = async ({ params: { eventId } }: EventPageProps) => {
  const user = await currentUser();
  const { event } = await getEventById(eventId[0]);
  const { attendance } = await getEventAttendance(eventId[0]);
  const yesCount = attendance?.filter((a) => a.response === "YES");
  const maybeCount = attendance?.filter((a) => a.response === "MAYBE");
  const noCount = attendance?.filter((a) => a.response === "NO");
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
      {currentUserAttendance ? (
        <Button variant="secondary">Change response</Button>
      ) : (
        <Button>Respond</Button>
      )}
    </main>
  );
};

export default EventPage;
