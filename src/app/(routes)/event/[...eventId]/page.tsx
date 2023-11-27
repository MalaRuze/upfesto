import { getEventById } from "@/lib/events";
import { getEventAttendance } from "@/lib/attendance";
import { currentUser } from "@clerk/nextjs";
import ResponseDialog from "@/app/(routes)/event/[...eventId]/ResponseDialog";
import UploadImageButton from "@/app/(routes)/event/[...eventId]/UploadImageButton";
import { Calendar, CalendarPlus, MapPin, User2 } from "lucide-react";
import { getPublicUserInfoById } from "@/lib/users";
import {
  getDetailedFormattedDateTime,
  splitStringAtFirstComma,
} from "@/lib/utils";
import AttendanceCard from "@/app/(routes)/event/[...eventId]/AttendanceCard";
import { Button } from "@/components/ui/button";
import ShareDialog from "@/app/(routes)/event/[...eventId]/ShareDialog";
import CalendarButton from "@/app/(routes)/event/[...eventId]/CalendarButton";
import LocationMap from "@/app/(routes)/event/[...eventId]/LocationMap";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

const EventPage = async ({ params: { eventId } }: EventPageProps) => {
  const { event } = await getEventById(eventId[0]);
  const user = await currentUser();
  const { attendance } = await getEventAttendance(eventId[0]);
  const currentUserAttendance = attendance?.find((a) => a.userId === user?.id);

  if (!event) {
    return <div>Loading ...</div>;
  }

  const hostDetails = await getPublicUserInfoById(event.hostId);
  const formattedDate = getDetailedFormattedDateTime(
    event.dateFrom,
    event.dateTo !== null ? event.dateTo : undefined,
  );
  const locationAddress =
    event.locationAddress !== null
      ? splitStringAtFirstComma(event.locationAddress)
      : undefined;

  return (
    <main className="flex min-h-screen flex-col sm:p-8 max-w-screen-xl mx-auto">
      <div className="bg-gradient-to-bl from-indigo-400 to-sky-100  h-64 w-full  sm:rounded-xl relative">
        {event.imageUrl !== null && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="object-cover h-full w-full sm:rounded-xl"
          />
        )}
        <div className="absolute bottom-4 right-4">
          <UploadImageButton eventId={event.id} imageUrl={event.imageUrl} />
        </div>
        {/* Date short */}
        <div className="absolute w-20 h-20 bg-white/80 bottom-4 left-4 rounded-xl p-2 flex flex-col justify-between">
          {/* Month */}
          <p className="text-center">
            {event.dateFrom.toLocaleString("en-GB", { month: "short" })}
          </p>
          {/* Day*/}
          <p className="text-4xl font-semibold text-center">
            {event.dateFrom.getDate()}
          </p>
        </div>
      </div>
      <h1 className="text-4xl p-4 w-full truncate">{event?.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-6 sm:gap-x-8 px-4 sm:px-0">
        <div className="col-span-3 ">
          {/* Event Info */}
          <div className="bg-gray-100 p-4 rounded-xl text-sm space-y-4">
            <h2 className="text-base font-semibold">Event Details</h2>
            <ul className="space-y-4">
              {hostDetails.user !== null && (
                <li className="flex gap-3 items-center">
                  <User2 size={20} className="flex-shrink-0" />
                  <div>
                    hosted by{" "}
                    <span className="font-semibold">
                      {hostDetails.user.fullName}
                    </span>
                  </div>
                </li>
              )}
              <li className="flex gap-3 items-center">
                <Calendar size={20} className="flex-shrink-0" />
                <div>
                  <span className="font-semibold">{formattedDate?.time}</span>{" "}
                  {formattedDate?.date}
                </div>
              </li>
              {locationAddress && (
                <li className="flex gap-3 items-center">
                  <MapPin size={20} className="flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    <span className="font-semibold">
                      {locationAddress.firstPart}
                    </span>
                    <span>{locationAddress.rest}</span>
                  </div>
                </li>
              )}
            </ul>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
        <div className="col-span-2 space-y-4">
          <AttendanceCard eventId={event.id} hostId={event.hostId} />
          <ResponseDialog
            eventId={event.id}
            userId={user?.id}
            currentUserAttendance={currentUserAttendance}
          />
          <div className="w-full grid grid-cols-2 gap-4">
            <ShareDialog />
            <CalendarButton event={event} />
          </div>
          {event.locationLat && event.locationLon && (
            <LocationMap
              lat={Number(event.locationLat)}
              lng={Number(event.locationLon)}
            />
          )}
        </div>
        {/*<div>*/}
        {/*  <ResponseDialog*/}
        {/*    currentUserAttendance={currentUserAttendance}*/}
        {/*    eventId={event.id}*/}
        {/*    userId={user?.id}*/}
        {/*  />*/}
        {/*  <EventHandlerDialog*/}
        {/*    mode="update"*/}
        {/*    trigger={<button>Update</button>}*/}
        {/*    event={event}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </main>
  );
};

export default EventPage;
