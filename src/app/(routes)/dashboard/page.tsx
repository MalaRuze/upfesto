import AddIcon from "@mui/icons-material/Add";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserEvents } from "@/lib/events";
import { Event } from "@prisma/client";
import { getTimeFromDate } from "@/lib/utils";

const DashboardPage = async () => {
  const { events } = await getUserEvents();
  return (
    <main className="flex min-h-screen flex-col px-24 pt-16 gap-8">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="grid grid-cols-3 gap-8">
        <Link href="/new-event">
          <Button
            variant="outline"
            className="h-60 flex flex-col items-center justify-around p-20 w-full"
          >
            <AddIcon className="text-4xl text-primary" />
            <p>Create event</p>
          </Button>
        </Link>
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
