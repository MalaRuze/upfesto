import EventsList from "@/app/(routes)/dashboard/EventsList";
import EventHandlerDialog from "@/components/EventHandlerDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserCreatedEvents, getuserReactedEvents } from "@/lib/db/events";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Upfesto",
};

const DashboardPage = async () => {
  const { events: eventsCreated } = await getUserCreatedEvents();
  const { events: eventsReacted } = await getuserReactedEvents();

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-xl flex-col px-6 pt-8">
      <h1 className="pb-4 text-2xl font-semibold">My Events</h1>
      <Tabs defaultValue="created">
        <TabsList className="mb-4 grid w-full grid-cols-2 sm:w-fit">
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="reacted">Reacted</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          {eventsCreated.length === 0 ? (
            <div className="mt-20 w-full text-center">
              <div>You have not created any events yet.</div>
              <EventHandlerDialog
                mode="create"
                trigger={
                  <Button
                    className="mx-auto mt-4 flex h-10 gap-2"
                    type="button"
                  >
                    <Plus className="h-5 w-5" />
                    <p>Create new event</p>
                  </Button>
                }
              />
            </div>
          ) : (
            <EventsList events={eventsCreated} type="created" />
          )}
        </TabsContent>
        <TabsContent value="reacted">
          {eventsReacted.length === 0 ? (
            <div className="mt-20 w-full text-center">
              You have not reacted to any other user event.
            </div>
          ) : (
            <EventsList events={eventsReacted} type="reacted" />
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default DashboardPage;
