import { z } from "zod";

const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const NewEventFormDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  dateFrom: z.date(),
  timeFrom: z.string().refine((value) => timeFormat.test(value), {
    message: "Time must be in format HH:MM",
  }),
  dateTo: z.date().optional(),
  timeTo: z
    .string()
    .refine((value) => timeFormat.test(value), {
      message: "Time must be in format HH:MM",
    })
    .optional(),
  hostId: z.string(),
});
