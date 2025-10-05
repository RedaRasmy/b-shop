import type z from "zod";
import type { emailPasswordSchema } from "./zod-schemas";

export type Credentials = z.infer<typeof emailPasswordSchema>

export type User = {
    id : string
    email : string
    role : 'admin' | 'customer',
    isEmailVerified : boolean
}

export type Status = "active" | "inactive"
export type Order = "asc" | "desc"

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};