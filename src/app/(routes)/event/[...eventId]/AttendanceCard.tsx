import { getEventAttendance } from "@/lib/db/attendance";
import { ResponseEnum } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Meh, X } from "lucide-react";

type AttendanceCardProps = {
  eventId: string;
  hostId: string;
};

const AttendanceCard = async ({ eventId, hostId }: AttendanceCardProps) => {
  const { attendance } = await getEventAttendance(eventId);
  const yesCount = attendance?.filter((a) => a.response === ResponseEnum.YES);
  const maybeCount = attendance?.filter(
    (a) => a.response === ResponseEnum.MAYBE,
  );
  const noCount = attendance?.filter((a) => a.response === ResponseEnum.NO);

  if (!attendance) {
    return <div>Loading ...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl h-content p-4 cursor-pointer">
          <div className="flex justify-between items-center pb-3">
            <h2 className="font-semibold ">Attendance</h2>
            <p className="text-sm text-secondary-foreground hover:underline">
              see all
            </p>
          </div>

          <div className="grid grid-cols-3 text-center text-sm">
            <div>
              <p>going</p>
              <div className="text-lg font-semibold">{yesCount?.length}</div>
            </div>
            <div>
              <p>maybe</p>
              <div className="text-lg font-semibold">{maybeCount?.length}</div>
            </div>
            <div>
              <p>can&apos;t go</p>
              <div className="text-lg font-semibold">{noCount?.length}</div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendance</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="going">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="going">
              Going
            </TabsTrigger>
            <TabsTrigger className="w-full" value="maybe">
              Maybe
            </TabsTrigger>
            <TabsTrigger className="w-full" value="cant-go">
              Can&apos;t go
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="going"
            className="max-h-96 overflow-y-auto pt-2 space-y-3 text-sm"
          >
            {yesCount?.map((user) => (
              <div className="flex items-center gap-3 px-2" key={user.userId}>
                <img
                  src={user.user.profileImageUrl}
                  alt={user.user.fullName}
                  className="w-7 h-7 rounded-full"
                />
                <p>{user.user?.fullName}</p>
                {user.userId === hostId ? (
                  <p className="text-gray-400 ml-auto">host</p>
                ) : (
                  <Check className="ml-auto text-green-500" />
                )}
              </div>
            ))}
          </TabsContent>
          <TabsContent
            value="maybe"
            className="max-h-96 overflow-y-auto pt-2 space-y-3 text-sm"
          >
            {maybeCount?.length !== 0 ? (
              maybeCount.map((user) => (
                <div className="flex items-center gap-3 px-2" key={user.userId}>
                  <img
                    src={user.user.profileImageUrl}
                    alt={user.user.fullName}
                    className="w-8 h-8 rounded-full"
                  />
                  <p>{user.user?.fullName}</p>
                  {user.userId === hostId ? (
                    <p className="text-gray-400 ml-auto">host</p>
                  ) : (
                    <Meh className="ml-auto" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No responses</p>
            )}
          </TabsContent>
          <TabsContent
            value="cant-go"
            className="max-h-96 overflow-y-auto pt-2 space-y-3 text-sm"
          >
            {noCount?.length !== 0 ? (
              noCount.map((user) => (
                <div className="flex items-center gap-3 px-2" key={user.userId}>
                  <img
                    src={user.user.profileImageUrl}
                    alt={user.user.fullName}
                    className="w-8 h-8 rounded-full"
                  />
                  <p>{user.user?.fullName}</p>
                  {user.userId === hostId ? (
                    <p className="text-gray-400 ml-auto">host</p>
                  ) : (
                    <X className="ml-auto text-red-500" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No responses</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceCard;
