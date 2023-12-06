import { Button } from "@/components/ui/button";
import { getUserEvents } from "@/lib/db/events";
import { Event } from "@prisma/client";
import EventHandlerDialog from "@/components/EventHandlerDialog";
import EventCard from "@/app/(routes)/dashboard/EventCard";
import { Plus } from "lucide-react";

const DashboardPage = async () => {
  const { events } = await getUserEvents();
  return (
    <main className="flex min-h-screen max-w-screen-xl mx-auto flex-col px-6 pt-8">
      <h1 className="text-2xl font-semibold pb-4">Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        {events
          ?.sort(
            (a, b) =>
              new Date(a.dateCreated).getTime() -
              new Date(b.dateCreated).getTime(),
          )
          .map((event: Event) => <EventCard event={event} key={event.id} />)}
      </div>
    </main>
  );
};

export default DashboardPage;
