import z from "zod";


export const PasswordSchema = z.string('This field is required')
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password is too long");
