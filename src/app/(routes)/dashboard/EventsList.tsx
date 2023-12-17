"use client";

import EventCard from "@/app/(routes)/dashboard/EventCard";
import EventHandlerDialog from "@/components/EventHandlerDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Attendance, Event } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";

type EventWithAttendance = Event & {
  attendances: Attendance[];
};

type EventsListProps = {
  events: EventWithAttendance[];
  type: "created" | "reacted";
};

const EventsList = ({ events, type }: EventsListProps) => {
  const [sortOrder, setSortOrder] = useState("descending");
  const [filter, setFilter] = useState("all");

  const filteredEvents = events?.filter((event) => {
    const now = new Date();
    switch (filter) {
      case "all":
        return true;
      case "past":
        return new Date(event.dateFrom) < now;
      case "upcoming":
        return new Date(event.dateFrom) > now;
      default:
        return true;
    }
  });

  const sortedAndFilteredEvents = filteredEvents?.sort((a, b) => {
    const dateA = new Date(a.dateFrom).getTime();
    const dateB = new Date(b.dateFrom).getTime();
    return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
  });

  return (
    <>
      {/* sort & filter */}
      <div className="mb-4 flex w-full flex-col justify-end gap-2 min-[450px]:flex-row sm:-mt-14">
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value)}
        >
          <SelectTrigger className="sm:w-44">
            <Label>Order:</Label>
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent
            ref={(ref) =>
              ref?.addEventListener("touchend", (e) => e.preventDefault())
            }
          >
            <SelectItem value="ascending">Ascending</SelectItem>
            <SelectItem value="descending">Descending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter} onValueChange={(value) => setFilter(value)}>
          <SelectTrigger className="sm:w-44">
            <Label>Show:</Label>
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent
            ref={(ref) =>
              ref?.addEventListener("touchend", (e) => e.preventDefault())
            }
          >
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="past">Past</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* events */}
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {type === "created" && (
          <EventHandlerDialog
            mode="create"
            trigger={
              <Button
                variant="outline"
                className="flex h-60 w-full flex-col items-center justify-around p-20"
                type="button"
              >
                <Plus className="h-8 w-8 text-primary" />
                <p>Create event</p>
              </Button>
            }
          />
        )}
        {sortedAndFilteredEvents?.map((event: EventWithAttendance) => (
          <EventCard
            event={event}
            key={event.id}
            attendances={event.attendances}
          />
        ))}
      </div>
    </>
  );
};

export default EventsList;
