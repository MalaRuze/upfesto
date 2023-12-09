"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFormattedDateTime } from "@/lib/utils";
import { Attendance, Event, ResponseEnum } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Check, Meh, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EventCardProps = {
  event: Event;
  attendances: Attendance[];
};

const EventCard = ({ event, attendances }: EventCardProps) => {
  const { user } = useUser();
  const formattedDateTime = getFormattedDateTime(
    event.dateFrom,
    event.dateTo !== null ? event.dateTo : undefined,
  );
  const totalAttendance = attendances?.length;
  const yesAttendance = attendances?.filter(
    (attendance) => attendance.response === "YES",
  ).length;

  const currentUserAttendance =
    event.hostId !== user?.id
      ? attendances?.find((attendance) => attendance.userId === user?.id)
      : null;

  return (
    <Link href={`/event/${event.id}`}>
      <Button
        variant="outline"
        className="h-60 grid grid-rows-5 w-full p-0 justify-normal truncate"
      >
        {/* Image */}
        <div className="bg-gradient-to-bl from-indigo-400 to-sky-100 w-full h-full rounded-t-xl row-span-3">
          {event?.imageUrl !== null && (
            <img
              src={event?.imageUrl}
              alt={event?.title}
              className="object-cover h-full w-full rounded-t-xl"
            />
          )}
        </div>
        {/* Event info */}
        <div className="row-span-2 w-full h-full flex flex-col items-start justify-around p-3">
          <p className="text-gray-500">{formattedDateTime}</p>
          <h2 className="text-lg font-bold ">{event.title}</h2>
          <div className="flex items-center justify-between w-full">
            <div className="text-gray-500">
              {totalAttendance} <span>reacted - </span>
              {yesAttendance} <span>going</span>
            </div>
            {currentUserAttendance?.response === ResponseEnum.YES && (
              <Badge variant="secondary">
                <Check className="pr-1 text-green-500 w-5 h-5" />
                <span className="pr-1 ">Going</span>
              </Badge>
            )}
            {currentUserAttendance?.response === ResponseEnum.MAYBE && (
              <Badge variant="secondary">
                <Meh className="pr-1 w-5 h-5" />
                <span className="pr-1">Maybe</span>
              </Badge>
            )}
            {currentUserAttendance?.response === ResponseEnum.NO && (
              <Badge variant="secondary">
                <X className="pr-1 text-red-500 w-5 h-5" />
                <span className="pr-1 ">Can&apos;t go</span>
              </Badge>
            )}
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default EventCard;
