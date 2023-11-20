import AddIcon from "@mui/icons-material/Add";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserEvents } from "@/lib/events";
import { Event } from "@prisma/client";
import { getTimeFromDate } from "@/lib/utils";
import EventHandlerDialog from "@/components/EventHandlerDialog";

const DashboardPage = async () => {
  const { events } = await getUserEvents();
  return (
    <main className="flex min-h-screen flex-col px-24 pt-16 gap-8">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="grid grid-cols-3 gap-8">
        <EventHandlerDialog
          mode="create"
          trigger={
            <Button
              variant="outline"
              className="h-60 flex flex-col items-center justify-around p-20 w-full"
              type="button"
            >
              <AddIcon className="text-4xl text-primary" />
              <p>Create event</p>
            </Button>
          }
        />
        {events?.map((event: Event) => (
          <Link href={`/event/${event.id}`} key={event.id}>
            <Button
              variant="outline"
              className="h-60 flex flex-col items-center justify-around p-20 w-full"
            >
              <h2>{event.title}</h2>
              <p>{event.dateFrom.getDate()}</p>
              <p>{getTimeFromDate(event.dateFrom)}</p>
            </Button>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default DashboardPage;
