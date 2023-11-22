"use client";

import { Attendance, ResponseEnum } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AttendanceFormDataSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createNewAttendance } from "@/app/_actions";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type ResponseDialogProps = {
  currentUserAttendance?: Attendance;
  eventId: string;
  userId?: string;
};

const ResponseDialog = ({
  currentUserAttendance,
  userId,
  eventId,
}: ResponseDialogProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof AttendanceFormDataSchema>>({
    resolver: zodResolver(AttendanceFormDataSchema),
    defaultValues: {
      response: currentUserAttendance?.response,
      userId: userId,
      eventId: eventId,
    },
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();

  const onSubmit = async (values: z.infer<typeof AttendanceFormDataSchema>) => {
    const res = await createNewAttendance(values);
    console.log(values);
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
      title: "Response saved",
      description: "Your response has been saved.",
    });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Respond</Button>
      </DialogTrigger>
      {!userId ? (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Please sing in</DialogTitle>
            <DialogDescription>
              To respond to this event, please sign in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mx-auto">
            <Link href={`/sign-in?redirect_url=` + pathname}>
              <Button>Sing in</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>My response</DialogTitle>
            <DialogDescription>
              Let the host know if you can make it to this event.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        onValueChange={(value) =>
                          field.onChange(value === "" ? undefined : value)
                        }
                        defaultValue={currentUserAttendance?.response}
                        className="justify-between"
                      >
                        <ToggleGroupItem value="YES" aria-label="Toggle yes">
                          👍 Going
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value={ResponseEnum.MAYBE}
                          aria-label="Toggle maybe"
                        >
                          🤷‍♂️ Maybe
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value={ResponseEnum.NO}
                          aria-label="Toggle no"
                        >
                          👎 Can t go
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.response?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <Button type="submit">Save response</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ResponseDialog;
