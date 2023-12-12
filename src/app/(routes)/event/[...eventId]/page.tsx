import EventHandlerDialog from "@/components/EventHandlerDialog";
import { Button } from "@/components/ui/button";
import { getEventAttendance } from "@/lib/db/attendance";
import { getEventById } from "@/lib/db/events";
import { getEventPosts } from "@/lib/db/posts";
import { findSubscriptionById } from "@/lib/db/subscriptions";
import { getPublicUserInfoById } from "@/lib/db/users";
import {
  getDetailedFormattedDateTime,
  splitStringAtFirstComma,
} from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { Calendar, MapPin, Pencil, User2 } from "lucide-react";
import React from "react";

import AttendanceCard from "./AttendanceCard";
import CalendarButton from "./CalendarButton";
import LocationMap from "./LocationMap";
import NotFound from "./NotFound";
import PostCard from "./PostCard";
import PostHandlerDialog from "./PostHandlerDialog";
import ResponseDialog from "./ResponseDialog";
import ShareDialog from "./ShareDialog";
import SubscriptionSwitch from "./SubscriptionSwitch";
import UploadImageButton from "./UploadImageButton";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export const generateMetadata = async ({
  params: { eventId },
}: EventPageProps) => {
  const { event } = await getEventById(eventId[0]);

  if (!event) {
    return {
      title: "Event not found | Upfesto",
    };
  }

  return {
    title: `${event.title} | Upfesto`,
    openGraph: {
      title: `${event.title} | Upfesto`,
      url: `https://upfesto.com/event/${event.id}`,
      type: "website",
      images: [
        {
          url: event.imageUrl,
          width: 800,
          height: 600,
          alt: event.title,
        },
      ],
    },
  };
};

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
    <main className="mx-auto flex min-h-screen max-w-screen-xl flex-col sm:p-8">
      {/* event image */}
      <div className="relative h-64 w-full  bg-gradient-to-bl from-indigo-400  to-sky-100 sm:rounded-xl">
        {event.imageUrl !== null && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover sm:rounded-xl"
          />
        )}
        {isHost && (
          <div className="absolute bottom-4 right-4">
            <UploadImageButton eventId={event.id} imageUrl={event.imageUrl} />
          </div>
        )}
        {/* date */}
        <div className="absolute bottom-4 left-4 flex h-20 w-20 flex-col justify-between rounded-xl bg-white/80 p-2">
          {/* month */}
          <p className="text-center">
            {event.dateFrom.toLocaleString("en-GB", { month: "short" })}
          </p>
          {/* day*/}
          <p className="text-center text-4xl font-semibold">
            {event.dateFrom.getDate()}
          </p>
        </div>
      </div>
      {/* event title */}
      <h1 className="w-full break-words p-4 text-4xl">{event?.title}</h1>
      <div className="grid grid-cols-1 gap-y-4 px-4 sm:grid-cols-5 sm:gap-x-8 sm:px-0">
        {/* event detail section */}
        <div className="sm:col-span-3">
          <div className="relative space-y-4 rounded-xl bg-gray-100 p-4 text-sm">
            <h2 className="text-base font-semibold">Event Details</h2>
            {/* edit event button */}
            {isHost && (
              <EventHandlerDialog
                mode="update"
                trigger={
                  <Button
                    variant="outline"
                    className="absolute -top-1 right-3 flex gap-2"
                    size="sm"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                }
                event={event}
              />
            )}
            {/* event details */}
            <ul className="space-y-4">
              {hostDetails.user !== null && (
                <li className="flex items-center gap-3">
                  <User2 size={20} className="flex-shrink-0" />
                  <div>
                    hosted by{" "}
                    <span className="font-semibold">
                      {hostDetails.user.fullName}
                    </span>
                  </div>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Calendar size={20} className="flex-shrink-0" />
                <div>
                  <span className="font-semibold">
                    {formattedEventDate?.time}
                  </span>{" "}
                  {formattedEventDate?.date}
                </div>
              </li>
              {formattedEventLocationAddress && (
                <li className="flex items-center gap-3">
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
        <div className="space-y-4 sm:col-span-2 sm:row-span-3">
          <AttendanceCard eventId={event.id} hostId={event.hostId} />
          <ResponseDialog
            eventId={event.id}
            userId={user?.id}
            currentUserAttendance={currentUserAttendance}
          />
          <div className="grid w-full grid-cols-2 gap-4">
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
        <div className=" space-y-4 sm:col-span-3">
          {/* create post button */}
          {user && isHost && (
            <div className="flex w-full items-center gap-4 rounded-xl bg-gray-100 p-4">
              <img
                src={user.imageUrl}
                alt="avatar"
                className="h-8 w-8 rounded-full"
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
            <div className="hidden py-12 text-center text-gray-400 sm:block">
              No posts yet
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default EventPage;
