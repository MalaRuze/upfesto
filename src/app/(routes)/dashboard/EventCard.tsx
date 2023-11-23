import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFormattedDateTime } from "@/lib/utils";
import { Event } from "@prisma/client";
import { getEventAttendance } from "@/lib/attendance";

type EventCardProps = {
  event: Event;
};

const EventCard = async ({ event }: EventCardProps) => {
  const formattedDateTime = getFormattedDateTime(
    event.dateFrom,
    event.dateTo !== null ? event.dateTo : undefined,
  );

  const { attendance } = await getEventAttendance(event.id);
  const totalAttendance = attendance?.length;
  const yesAttendance = attendance?.filter(
    (attendance) => attendance.response === "YES",
  ).length;

  return (
    <Link href={`/event/${event.id}`}>
      <Button
        variant="outline"
        className="h-60 grid grid-rows-5 w-full p-0 justify-normal"
      >
        <div className="bg-gradient-to-bl from-indigo-400 to-sky-100 w-full h-full rounded-t-xl row-span-3">
          {event?.imageUrl !== null && (
            <img
              src={event?.imageUrl}
              alt={event?.title}
              className="object-cover h-full w-full rounded-t-xl"
            />
          )}
        </div>
        <div className="row-span-2 w-full h-full flex flex-col items-start justify-around p-3">
          <p className="text-gray-500">{formattedDateTime}</p>
          <h2 className="text-lg font-bold">{event.title}</h2>
          <div className="text-gray-500">
            {totalAttendance} <span>reacted - </span>
            {yesAttendance} <span>going</span>
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default EventCard;
