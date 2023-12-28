"use client";

import { createEventAction } from "@/actions/createEventAction";
import deleteEventAction from "@/actions/deleteEventAction";
import { updateEventAction } from "@/actions/updateEventAction";
import PlacesSearchBox from "@/components/PlacesSearchBox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  NewEventFormDataSchema,
  UpdateEventFormDataSchema,
} from "@/lib/schema";
import { cn, getTimeFromDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateProps = {
  mode: "create";
  trigger: React.ReactNode;
};

type UpdateProps = {
  mode: "update";
  trigger: React.ReactNode;
  event: Event;
};

const getEventFormSchema = (mode: "create" | "update") => {
  switch (mode) {
    case "create":
      return NewEventFormDataSchema;
    case "update":
      return UpdateEventFormDataSchema;
  }
};

const EventHandlerDialog = (props: CreateProps | UpdateProps) => {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [includeEndDateTime, setIncludeEndDateTime] = useState(
    props.mode === "update" && props.event.dateTo !== null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const schema = getEventFormSchema(props.mode);
  /* times to be used in the time select in format HH:MM */
  const times: string[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = i < 10 ? `0${i}` : i;
      const minute = j === 0 ? "00" : j;
      times.push(`${hour}:${minute}`);
    }
  }

  const getDefaultValues = () => {
    switch (props.mode) {
      case "update":
        return {
          id: props.event.id,
          title: props.event.title,
          description: props.event.description,
          locationAddress: props.event.locationAddress,
          locationLon: Number(props.event.locationLon) || null,
          locationLat: Number(props.event.locationLat) || null,
          imageUrl: props.event.imageUrl,
          dateCreated: props.event.dateCreated,
          dateFrom: props.event.dateFrom,
          timeFrom: props.event.dateFrom
            ? getTimeFromDate(props.event.dateFrom)
            : null,
          dateTo: props.event.dateTo,
          timeTo: props.event.dateTo
            ? getTimeFromDate(props.event.dateTo)
            : null,
          hostId: props.event.hostId,
        } as z.infer<typeof schema>;
      case "create":
        return {
          title: "",
          timeFrom: "12:00",
          hostId: user?.id,
          dateFrom: new Date(),
          description: "",
        } as z.infer<typeof schema>;
    }
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  /* reset form when props change */
  useEffect(() => {
    form.reset(getDefaultValues());
  }, [props, user]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    /* create new event or update existing event */
    const res =
      props.mode === "create"
        ? await createEventAction(
            values as z.infer<typeof NewEventFormDataSchema>,
          )
        : await updateEventAction(
            values as z.infer<typeof UpdateEventFormDataSchema>,
          );

    if (!res) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }
    if (res.success === false) {
      toast({
        title: "Something went wrong",
        description: res.error + " Please try again later.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Event saved",
      description: "Your event has been saved.",
    });

    form.reset();
    setIsDialogOpen(false);
    router.push(`/event/${res.event?.id}`);
  };

  const onDelete = async () => {
    if (props.mode !== "update") return;
    const res = await deleteEventAction(props.event.id);
    if (!res) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }
    if (res.success === false) {
      toast({
        title: "Something went wrong",
        description: res.error + " Please try again later.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Event deleted",
      description: "Your event has been deleted.",
    });
    router.push("/dashboard");
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
        setIsDialogOpen(!isDialogOpen);
        if (props.mode === "create") {
          setIncludeEndDateTime(false);
        }
      }}
      open={isDialogOpen}
    >
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto rounded-xl px-2 min-[450px]:p-6">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Create Event" : "Update Event"}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "create"
              ? "Create a new event"
              : "Update an existing event"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            {/*title*/}
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type in title"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/*start date and time*/}
            <div className="flex min-[364px]:flex-row gap-4 flex-col">
              {/*dateFrom*/}
              <FormField
                control={form.control}
                name="dateFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "min-[364px]:w-[240px] w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            // check if dateTo is before dateFrom
                            if (
                              includeEndDateTime &&
                              form.watch("dateTo") &&
                              date &&
                              form.watch("dateTo")! < date
                            ) {
                              const dateToPlusOne = new Date(date);
                              dateToPlusOne.setDate(
                                dateToPlusOne.getDate() + 1,
                              );
                              form.setValue("dateTo", dateToPlusOne);
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          defaultMonth={field.value}
                          initialFocus
                          ISOWeek
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>
                      {form.formState.errors.dateFrom?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/*timeFrom*/}
              <FormField
                control={form.control}
                name="timeFrom"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Start Time</FormLabel>
                    <Select
                      onValueChange={(time) => {
                        field.onChange(time);
                        // check if timeTo is before timeFrom
                        if (
                          form.watch("dateFrom") &&
                          form.watch("dateTo") &&
                          isSameDay(
                            form.watch("dateFrom"),
                            form.watch("dateTo")!,
                          ) &&
                          time > form.watch("timeTo")!
                        ) {
                          form.setValue("timeTo", time);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick a time" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <ScrollArea className="h-72 w-full">
                          {times.map((time, index) => (
                            <SelectItem key={index} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.timeFrom?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            {/*end date and time*/}
            {includeEndDateTime && (
              <div className="flex min-[364px]:flex-row gap-4 flex-col">
                {/*dateTo*/}
                <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "min-[364px]:w-[240px] w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={form.watch("dateFrom") === undefined}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? field.value : undefined}
                            onSelect={(date) => {
                              field.onChange(date);
                            }}
                            disabled={(date) =>
                              date < form.watch("dateFrom") &&
                              !isSameDay(date, form.watch("dateFrom"))
                            }
                            defaultMonth={field.value ? field.value : undefined}
                            initialFocus
                            ISOWeek
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage>
                        {form.formState.errors.dateTo?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {/*timeTo*/}
                <FormField
                  control={form.control}
                  name="timeTo"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>End Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ? field.value : undefined}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={form.watch("dateTo") === undefined}
                          >
                            <SelectValue placeholder="Pick a time" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <ScrollArea className="h-72  w-full ">
                            {times.map((time, index) => {
                              // condition to make sure that the end time is after the start time
                              if (
                                form.watch("dateTo") !== undefined &&
                                form.watch("dateFrom") !== null &&
                                form.watch("dateFrom").toDateString() ===
                                  form.watch("dateTo")?.toDateString() &&
                                time < form.watch("timeFrom")
                              ) {
                                return null;
                              }

                              return (
                                <SelectItem key={index} value={time}>
                                  {time}
                                </SelectItem>
                              );
                            })}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.timeTo?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            )}
            {/*include end date and time*/}
            <Button
              variant="link"
              type="button"
              className="p-0"
              onClick={() => {
                const newIncludeEndDateTime = !includeEndDateTime;
                setIncludeEndDateTime(newIncludeEndDateTime);
                // set end date and time to start date + 1 day at 12:00 if end date and time is included, otherwise set to null
                if (newIncludeEndDateTime) {
                  const dateFromPlusOne = new Date(form.watch("dateFrom"));
                  dateFromPlusOne.setDate(dateFromPlusOne.getDate() + 1);
                  form.setValue("dateTo", dateFromPlusOne);
                  form.setValue("timeTo", "12:00");
                } else {
                  form.setValue("dateTo", null);
                  form.setValue("timeTo", null);
                }
              }}
            >
              {includeEndDateTime ? "- " : "+ "}End Date and Time
            </Button>
            {/*location*/}
            <PlacesSearchBox
              onSelectAddress={(locationAddress, locationLat, locationLon) => {
                form.setValue("locationAddress", locationAddress);
                form.setValue("locationLat", locationLat);
                form.setValue("locationLon", locationLon);
              }}
              defaultValue={
                props.mode === "update" && props.event.locationAddress !== null
                  ? props.event.locationAddress
                  : undefined
              }
            />
            <FormMessage>
              {form.formState.errors.locationAddress?.message}
              {form.formState.errors.locationLon?.message}
              {form.formState.errors.locationLat?.message}
            </FormMessage>
            {/*description*/}
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is the description of the event?"
                      className="h-40 resize-none"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* footer */}
            <DialogFooter className="flex gap-3">
              {props.mode === "update" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm delete</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => onDelete()}
                      >
                        Delete Event
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button type="submit">
                {props.mode === "create" ? "Create event" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventHandlerDialog;
