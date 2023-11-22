"use client";

import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  NewEventFormDataSchema,
  UpdateEventFormDataSchema,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { cn, getTimeFromDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createEventAction, updateEventAction } from "@/app/_actions";
import { CalendarIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import PlacesSearchBox from "@/components/PlacesSearchBox";

type CreateProps = {
  mode: "create";
  trigger: React.ReactNode;
};

type UpdateProps = {
  mode: "update";
  trigger: React.ReactNode;
  event: Event;
};

// function to get the correct schema based on the mode
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
  // state to keep track of whether the end date and time should be included
  const [includeEndDateTime, setIncludeEndDateTime] = useState(
    props.mode === "update" && props.event.dateTo !== null,
  );
  // state to keep track of whether the dialog is open
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // get the correct schema based on the mode
  const schema = getEventFormSchema(props.mode);
  // times to be used in the time select in format HH:MM
  const times: string[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = i < 10 ? `0${i}` : i;
      const minute = j === 0 ? "00" : j;
      times.push(`${hour}:${minute}`);
    }
  }

  // function to get default values for the form
  const getDefaultValues = () => {
    switch (props.mode) {
      case "update":
        return {
          id: props.event.id,
          title: props.event.title,
          description: props.event.description,
          locationAddress: props.event.locationAddress,
          locationLon: Number(props.event.locationLon),
          locationLat: Number(props.event.locationLat),
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

  // initialize form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  // reset form when props change
  useEffect(() => {
    form.reset(getDefaultValues());
  }, [props, user]);

  // function to handle form submission
  const onSubmit = async (values: z.infer<typeof schema>) => {
    // create new event or update existing event
    const res =
      props.mode === "create"
        ? await createEventAction(values)
        : await updateEventAction({ ...values, id: props.event.id });

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

    // reset form and close dialog
    form.reset();
    setIsDialogOpen(false);
    // redirect to new event page
    router.push(`/event/${res.event?.id}`);
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
      {/*Dialog Trigger*/}
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        {/*Dialog Header*/}
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

        {/*Form*/}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            {/*Title*/}
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Type in title" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/*Start Date and Time*/}
            <div className="flex gap-4">
              {/*DateFrom*/}
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
                              "w-[240px] pl-3 text-left font-normal",
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
                            date < new Date() || date < new Date("1900-01-01")
                          }
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
              {/*TimeFrom*/}
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
            {/*End Date and Time*/}
            {includeEndDateTime && (
              <div className="flex gap-4">
                {/*DateTo*/}
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
                                "w-[240px] pl-3 text-left font-normal",
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
                              (date < form.watch("dateFrom") &&
                                !isSameDay(date, form.watch("dateFrom"))) ||
                              date < new Date("1900-01-01")
                            }
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
                {/*TimeTo*/}
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
            {/*Include End Date and Time*/}
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
            {/*Location*/}
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
            {/*Description*/}
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is the description of the event?"
                      className="resize-none h-40"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/*Dialog Footer with Submit Button*/}
            <DialogFooter>
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
