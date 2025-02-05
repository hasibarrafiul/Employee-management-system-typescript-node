import { z } from "zod";

const userSchema = z.object({
  id: z.string().max(5),
  name: z.string().max(40),
  kana: z.string().max(40),
  password: z.string().optional(),
  birthDate: z.string().optional(),
  club: z.string().max(40).optional(),
});

const checkUserSchema = z.object({
  userId: z.string().max(5),
  password: z.string().min(8).max(20),
});

const deleteUserSchema = z.object({
  id: z.string().max(5),
});

const checkAvailabilitySchema = z.object({
  id: z.string().max(5),
});

const userValidator = { userSchema, checkUserSchema, deleteUserSchema, checkAvailabilitySchema };
export default userValidator;
