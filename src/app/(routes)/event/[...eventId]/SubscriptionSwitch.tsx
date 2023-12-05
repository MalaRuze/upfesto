"use client";
import { Switch } from "@/components/ui/switch";
import { handleSubscriptionAction } from "@/actions/handleSubscriptionAction";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SubscriptionToggleProps = {
  eventId: string;
  userId?: string;
  subscription: boolean;
};

const SubscriptionSwitch = ({
  eventId,
  userId,
  subscription,
}: SubscriptionToggleProps) => {
  const { toast } = useToast();
  const pathname = usePathname();

  if (!userId) {
    return (
      <div className="flex items-center text-center w-full gap-2 border justify-around p-2 rounded-xl text-sm text-gray-500">
        <h2>
          Please{" "}
          <Link
            href={`/sign-in?redirect_url=` + pathname}
            className="underline"
          >
            sing in
          </Link>{" "}
          to allow notifications
        </h2>
      </div>
    );
  }

  const handleSubscriptionChange = async () => {
    const res = await handleSubscriptionAction({
      userId,
      eventId,
    });
    if (res?.success === false) {
      toast({
        title: "Something went wrong",
        description: res?.error + " Please try again later.",
        variant: "destructive",
      });
      return;
    }
    if (!res) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "You subscription preferences have been updated.",
    });
  };

  return (
    <div className="flex items-center w-full gap-2 border justify-around p-2 rounded-xl">
      <div className="flex gap-2">
        <Label className="font-semibold">Email notifications</Label>
        <Dialog>
          <DialogTrigger>
            <Info className="w-3 h-3" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>When I receive notifications?</DialogTitle>
            </DialogHeader>
            <p>Email notifications are sent only when:</p>
            <ul className="list-disc pl-8">
              <li>host add a new post to the event</li>
              <li>date and location changes are made to the event </li>
            </ul>
          </DialogContent>
        </Dialog>
      </div>
      <Switch
        defaultChecked={subscription}
        onCheckedChange={() => handleSubscriptionChange()}
      />
    </div>
  );
};

export default SubscriptionSwitch;
