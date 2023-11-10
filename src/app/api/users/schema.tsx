import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  profileImageUrl: z.string().url().optional(),
});
