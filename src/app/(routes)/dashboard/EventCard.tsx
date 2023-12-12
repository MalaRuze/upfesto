"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFormattedDateTime } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Attendance, Event, ResponseEnum } from "@prisma/client";
import { Check, Meh, X } from "lucide-react";
import Link from "next/link";

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
        className="grid h-60 w-full grid-rows-5 justify-normal truncate p-0"
      >
        {/* Image */}
        <div className="row-span-3 h-full w-full rounded-t-xl bg-gradient-to-bl from-indigo-400 to-sky-100">
          {event?.imageUrl !== null && (
            <img
              src={event?.imageUrl}
              alt={event?.title}
              className="h-full w-full rounded-t-xl object-cover"
            />
          )}
        </div>
        {/* Event info */}
        <div className="row-span-2 flex h-full w-full flex-col items-start justify-around p-3">
          <p className="text-gray-500">{formattedDateTime}</p>
          <h2 className="text-lg font-bold ">{event.title}</h2>
          <div className="flex w-full items-center justify-between">
            <div className="text-gray-500">
              {totalAttendance} <span>reacted - </span>
              {yesAttendance} <span>going</span>
            </div>
            {currentUserAttendance?.response === ResponseEnum.YES && (
              <Badge variant="secondary">
                <Check className="h-5 w-5 pr-1 text-green-500" />
                <span className="pr-1 ">Going</span>
              </Badge>
            )}
            {currentUserAttendance?.response === ResponseEnum.MAYBE && (
              <Badge variant="secondary">
                <Meh className="h-5 w-5 pr-1" />
                <span className="pr-1">Maybe</span>
              </Badge>
            )}
            {currentUserAttendance?.response === ResponseEnum.NO && (
              <Badge variant="secondary">
                <X className="h-5 w-5 pr-1 text-red-500" />
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
