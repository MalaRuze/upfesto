"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventHandlerDialog from "@/components/EventHandlerDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Attendance, Event } from "@prisma/client";
import EventCard from "@/app/(routes)/dashboard/EventCard";
import { useState } from "react";
import { Label } from "@/components/ui/label";

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
      <div className="flex flex-col min-[450px]:flex-row gap-2 w-full justify-end sm:-mt-14 mb-4">
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value)}
        >
          <SelectTrigger className="sm:w-44">
            <Label>Order:</Label>
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ascending">Ascending</SelectItem>
            <SelectItem value="descending">Descending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter} onValueChange={(value) => setFilter(value)}>
          <SelectTrigger className="sm:w-44">
            <Label>Show:</Label>
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="past">Past</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {type === "created" && (
          <EventHandlerDialog
            mode="create"
            trigger={
              <Button
                variant="outline"
                className="h-60 flex flex-col items-center justify-around p-20 w-full"
                type="button"
              >
                <Plus className="text-primary w-8 h-8" />
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
