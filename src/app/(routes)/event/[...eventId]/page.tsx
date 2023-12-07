import React from "react";
import { currentUser } from "@clerk/nextjs";
import { Calendar, MapPin, Pencil, User2 } from "lucide-react";
import { getEventById } from "@/lib/db/events";
import { getEventAttendance } from "@/lib/db/attendance";
import { getEventPosts } from "@/lib/db/posts";
import { findSubscriptionById } from "@/lib/db/subscriptions";
import { getPublicUserInfoById } from "@/lib/db/users";
import {
  getDetailedFormattedDateTime,
  splitStringAtFirstComma,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EventHandlerDialog from "@/components/EventHandlerDialog";
import NotFound from "./NotFound";
import SubscriptionSwitch from "./SubscriptionSwitch";
import PostCard from "./PostCard";
import PostHandlerDialog from "./PostHandlerDialog";
import ShareDialog from "./ShareDialog";
import CalendarButton from "./CalendarButton";
import LocationMap from "./LocationMap";
import AttendanceCard from "./AttendanceCard";
import ResponseDialog from "./ResponseDialog";
import UploadImageButton from "./UploadImageButton";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

const EventPage = async ({ params: { eventId } }: EventPageProps) => {
  const { event } = await getEventById(eventId[0]);

  if (!event) {
    return <NotFound />;
  }

  const { posts } = await getEventPosts(eventId[0]);
  const { attendance } = await getEventAttendance(eventId[0]);
  const user = await currentUser();
  const currentUserAttendance = attendance?.find((a) => a.userId === user?.id);
  const hostDetails = await getPublicUserInfoById(event.hostId);
  const isHost = user?.id === event.hostId;
  const isSubscribed = !user?.id
    ? false
    : Boolean(await findSubscriptionById(user.id, event.id));
  const formattedEventDate = getDetailedFormattedDateTime(
    event.dateFrom,
    event.dateTo !== null ? event.dateTo : undefined,
  );
  const formattedEventLocationAddress =
    event.locationAddress !== null
      ? splitStringAtFirstComma(event.locationAddress)
      : undefined;

  return (
    <main className="flex min-h-screen flex-col sm:p-8 max-w-screen-xl mx-auto">
      {/* event image */}
      <div className="bg-gradient-to-bl from-indigo-400 to-sky-100  h-64 w-full  sm:rounded-xl relative">
        {event.imageUrl !== null && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="object-cover h-full w-full sm:rounded-xl"
          />
        )}
        {isHost && (
          <div className="absolute bottom-4 right-4">
            <UploadImageButton eventId={event.id} imageUrl={event.imageUrl} />
          </div>
        )}
        {/* date */}
        <div className="absolute w-20 h-20 bg-white/80 bottom-4 left-4 rounded-xl p-2 flex flex-col justify-between">
          {/* month */}
          <p className="text-center">
            {event.dateFrom.toLocaleString("en-GB", { month: "short" })}
          </p>
          {/* day*/}
          <p className="text-4xl font-semibold text-center">
            {event.dateFrom.getDate()}
          </p>
        </div>
      </div>
      {/* event title */}
      <h1 className="text-4xl p-4 w-full truncate">{event?.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-y-4 sm:gap-x-8 px-4 sm:px-0">
        {/* event detail section */}
        <div className="sm:col-span-3">
          <div className="bg-gray-100 p-4 rounded-xl text-sm space-y-4 relative">
            <h2 className="text-base font-semibold">Event Details</h2>
            {/* edit event button */}
            {isHost && (
              <EventHandlerDialog
                mode="update"
                trigger={
                  <Button
                    variant="outline"
                    className="flex gap-2 absolute right-2 -top-2"
                  >
                    <Pencil /> Edit
                  </Button>
                }
                event={event}
              />
            )}
            {/* event details */}
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
                  <span className="font-semibold">
                    {formattedEventDate?.time}
                  </span>{" "}
                  {formattedEventDate?.date}
                </div>
              </li>
              {formattedEventLocationAddress && (
                <li className="flex gap-3 items-center">
                  <MapPin size={20} className="flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    <span className="font-semibold">
                      {formattedEventLocationAddress.firstPart}
                    </span>
                    <span>{formattedEventLocationAddress.rest}</span>
                  </div>
                </li>
              )}
            </ul>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
        {/* attendance section */}
        <div className="sm:col-span-2 sm:row-span-3 space-y-4">
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
          <SubscriptionSwitch
            eventId={event.id}
            userId={user?.id}
            subscription={isSubscribed}
          />
          {event.locationLat && event.locationLon && (
            <LocationMap
              lat={Number(event.locationLat)}
              lng={Number(event.locationLon)}
            />
          )}
        </div>
        {/* Posts section */}
        <div className=" sm:col-span-3 space-y-4">
          {/* create post button */}
          {user && isHost && (
            <div className="w-full bg-gray-100 flex p-4 items-center rounded-xl gap-4">
              <img
                src={user.imageUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <PostHandlerDialog
                eventId={event.id}
                mode="create"
                trigger={
                  <Button variant="outline" className="w-full">
                    Add a Post
                  </Button>
                }
              />
            </div>
          )}
          {/* posts */}
          {posts.length > 0 ? (
            posts
              .sort(
                (a, b) =>
                  new Date(b.dateCreated).getTime() -
                  new Date(a.dateCreated).getTime(),
              )
              .map((post) => (
                <PostCard
                  post={post}
                  hostFullName={hostDetails.user?.fullName}
                  hostProfileImageUrl={hostDetails.user?.profileImageUrl}
                  key={post.id}
                  isHost={isHost}
                />
              ))
          ) : (
            <div className="py-12 text-center text-gray-400 hidden sm:block">
              No posts yet
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default EventPage;
