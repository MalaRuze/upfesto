import { getUserCreatedEvents, getuserReactedEvents } from "@/lib/db/events";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "@/app/(routes)/dashboard/EventsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventHandlerDialog from "@/components/EventHandlerDialog";

const DashboardPage = async () => {
  const { events: eventsCreated } = await getUserCreatedEvents();
  const { events: eventsReacted } = await getuserReactedEvents();

  return (
    <main className="flex min-h-screen max-w-screen-xl mx-auto flex-col px-6 pt-8">
      <h1 className="text-2xl font-semibold pb-4">My Events</h1>
      <Tabs defaultValue="created">
        <TabsList className="grid w-full sm:w-fit grid-cols-2 mb-4">
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="reacted">Reacted</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          {eventsCreated.length === 0 ? (
            <div className="w-full text-center mt-20">
              <div>You have not created any events yet.</div>
              <EventHandlerDialog
                mode="create"
                trigger={
                  <Button
                    className="h-10 flex gap-2 mx-auto mt-4"
                    type="button"
                  >
                    <Plus className="w-5 h-5" />
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
            <div className="w-full text-center mt-20">
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
