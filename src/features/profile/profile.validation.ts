import z from "zod";



export const ProfileInfosSchema = z.object({
    fullName : z.string().min(3).max(100),
    phone : z.string().min(9).max(16),
    email : z.email()
})