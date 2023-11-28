import { z } from "zod";
import { PostTypeEnum, ResponseEnum } from "@prisma/client";

const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const NewEventFormDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  locationAddress: z.string().nullish(),
  locationLat: z.number().nullish(),
  locationLon: z.number().nullish(),
  imageUrl: z.string().nullish(),
  dateFrom: z.date(),
  timeFrom: z.string().refine((value) => timeFormat.test(value), {
    message: "Time must be in format HH:MM",
  }),
  dateTo: z.date().nullish(),
  timeTo: z
    .string()
    .refine((value) => timeFormat.test(value), {
      message: "Time must be in format HH:MM",
    })
    .nullish(),
  hostId: z.string(),
});

export const NewEventDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  locationAddress: z.string().nullish(),
  locationLat: z.string().nullish(),
  locationLon: z.string().nullish(),
  imageUrl: z.string().nullish(),
  dateFrom: z.date(),
  dateTo: z.date().nullish(),
  hostId: z.string(),
});

export const UpdateEventFormDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().nullish(),
  locationAddress: z.string().nullish(),
  locationLat: z.number().nullish(),
  locationLon: z.number().nullish(),
  imageUrl: z.string().nullish(),
  dateFrom: z.date(),
  timeFrom: z.string().refine((value) => timeFormat.test(value), {
    message: "Time must be in format HH:MM",
  }),
  dateTo: z.date().nullish(),
  timeTo: z
    .string()
    .refine((value) => timeFormat.test(value), {
      message: "Time must be in format HH:MM",
    })
    .nullish(),
  hostId: z.string(),
});

export const UpdateEventDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().nullish(),
  locationAddress: z.string().nullish(),
  locationLat: z.string().nullish(),
  locationLon: z.string().nullish(),
  imageUrl: z.string().nullish(),
  dateFrom: z.date(),
  dateTo: z.date().nullish(),
  hostId: z.string(),
});

export const AttendanceFormDataSchema = z.object({
  eventId: z.string(),
  userId: z.string(),
  response: z.nativeEnum(ResponseEnum).optional(),
});

export const AttendanceDataSchema = z.object({
  eventId: z.string(),
  userId: z.string(),
  response: z.nativeEnum(ResponseEnum),
});

export const PostDataSchema = z.object({
  eventId: z.string(),
  message: z.string().min(5).max(300),
  type: z.nativeEnum(PostTypeEnum),
});

export const UpdatePostDataSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  message: z.string().min(5).max(300),
});
