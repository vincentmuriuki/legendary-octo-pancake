import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('In valid email'),
    password: z.string().min(5, 'Password must be at least 5 characters long')
})

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(5, 'Password must be at least 5 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
})