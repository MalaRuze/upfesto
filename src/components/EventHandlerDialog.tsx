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
import React, { useState } from "react";
import { createNewEvent, updateEvent } from "@/app/_actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CalendarIcon } from "lucide-react";
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
import { format } from "date-fns";
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
  const { toast } = useToast();
  const router = useRouter();
  const [includeEndDateTime, setIncludeEndDateTime] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const schema = getEventFormSchema(props.mode);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: async () => {
      switch (props.mode) {
        case "update":
          return {
            id: props.event.id,
            title: props.event.title,
            description: props.event.description
              ? props.event.description
              : undefined,
            location: props.event.location ? props.event.location : undefined,
            imageUrl: props.event.imageUrl ? props.event.imageUrl : undefined,
            dateCreated: props.event.dateCreated,
            dateFrom: props.event.dateFrom,
            timeFrom: getTimeFromDate(props.event.dateFrom),
            dateTo: props.event.dateTo ? props.event.dateTo : undefined,
            timeTo: props.event.dateTo
              ? getTimeFromDate(props.event.dateTo)
              : undefined,
            hostId: props.event.hostId,
          } as z.infer<typeof schema>;
        case "create":
          return {
            timeFrom: "12:00",
            hostId: user?.id,
          } as z.infer<typeof schema>;
      }
    },
  });
  const times: string[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = i < 10 ? `0${i}` : i;
      const minute = j === 0 ? "00" : j;
      times.push(`${hour}:${minute}`);
    }
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const res =
      props.mode === "create"
        ? await createNewEvent(values)
        : await updateEvent({ ...values, id: props.event.id });

    if (!res) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }
    if (res.error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later. Error: " + res.error[0].message,
        variant: "destructive",
      });
      return;
    }

    form.reset();
    router.push(`/event/${res.event?.id}`);
    setIsDialogOpen(false);
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
        setIsDialogOpen(!isDialogOpen);
      }}
      open={isDialogOpen}
    >
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
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
                            if (
                              form.watch("dateTo") !== undefined &&
                              date !== undefined &&
                              form.watch("dateTo")! < date
                            ) {
                              form.setValue("dateTo", date);
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick a time" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <ScrollArea className="h-72 w-full ">
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
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.watch("dateFrom") ||
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick a time" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <ScrollArea className="h-72 w-full ">
                            {times.map((time, index) => {
                              // condition to make sure that the end time is after the start time
                              if (
                                form.watch("dateTo") !== undefined &&
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
            <Button
              variant="link"
              type="button"
              className="p-0"
              onClick={() => {
                setIncludeEndDateTime(!includeEndDateTime);
                includeEndDateTime
                  ? form.setValue("dateTo", undefined)
                  : form.setValue("timeTo", undefined);
              }}
            >
              {includeEndDateTime ? "- " : "+ "}End Date and Time
            </Button>
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
