import type { Credentials, User } from "@/lib/types"
import { http, HttpResponse } from "msw"

export const handlers = [
    // Login
    http.post("/api/auth/login", async ({ request }) => {
        const { email, password } = (await request.json()) as Credentials

        if (email === "test@example.com" && password === "password123") {
            return HttpResponse.json({
                user: {
                    id: "test-id",
                    email: "test@example.com",
                    role: "admin",
                    isEmailVerified: false,
                } as User,
                message: "User logged in successfully",
                // token: "fake-jwt-token",
            })
        }

        return HttpResponse.json(
            { message: "Email or password is incorrect" },
            { status: 401 }
        )
    }),

    // Register
    http.post("/api/auth/register", async ({ request }) => {
        const { email, password } = (await request.json()) as Credentials

        if (email && password) {
            if (email === "test@example.com") {
                return HttpResponse.json(
                    { message: "Email already in use" },
                    {
                        status: 400,
                    }
                )
            } else {
                return HttpResponse.json({
                    user: { id: "new-account-id", email },
                    message: "User registered and logged in successfully",
                })
            }
        }

        return HttpResponse.json(
            { message: "Registration failed" },
            { status: 400 }
        )
    }),

    // Refresh handler
    http.post("/api/auth/refresh", async () => {
        return HttpResponse.json(
            { message: "Refresh token not provided" },
            { status: 401 }
        )
    }),

    http.post("/api/auth/logout", async () => {}),

    http.get("/api/auth/me", async () => {
        return HttpResponse.json({
            user: {
                id: "test-id",
                email: "test@example.com",
                role: "admin",
                isEmailVerified: false,
            },
        })
    }),


]
