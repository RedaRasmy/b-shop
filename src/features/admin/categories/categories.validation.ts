import { SlugSchema, StatusSchema } from "@/lib/zod-schemas";
import z from "zod";


export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  slug : SlugSchema ,
  status: StatusSchema,
})

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;