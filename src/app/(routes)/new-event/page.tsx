"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewEvent } from "@/app/_actions";
import { NewEventFormDataSchema } from "@/lib/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewEventPage = () => {
  const { user } = useUser();
  const form = useForm<z.infer<typeof NewEventFormDataSchema>>({
    resolver: zodResolver(NewEventFormDataSchema),
    defaultValues: {
      hostId: user?.id,
      timeFrom: "12:00",
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
  const [includeEndDateTime, setIncludeEndDateTime] = useState(false);
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof NewEventFormDataSchema>) => {
    const res = await createNewEvent(values);

    if (!res) {
      setSubmitError("Something went wrong");
      return;
    }
    if (res.error) {
      setSubmitError(res.error[0].message);
      return;
    }

    form.reset();
    router.push(`/event/${res.event?.id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-2xl font-bold pt-12 pb-8">New Event</h1>
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-96">
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
          <Button type="submit">Create Event</Button>
        </form>
      </Form>
    </main>
  );
};

export default NewEventPage;
