import type { Credentials } from "@/lib/types"
import { http, HttpResponse } from "msw"
import {
    mockedAdmin,
    mockedAdminCredentials,
    mockedCustomer,
    mockedCustomerCredentials,
} from "./mocked-users"

export const authHandlers = [
    // Login
    http.post("/api/auth/login", async ({ request }) => {
        const { email, password } = (await request.json()) as Credentials

        if (email === "test@example.com" && password === "password123") {
            return HttpResponse.json({
                user: mockedCustomer,
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
        const credentials = (await request.json()) as Credentials
        const { email, password } = credentials

        // Success case for customer user
        if (
            email === mockedCustomerCredentials.email &&
            password === mockedCustomerCredentials.password
        ) {
            return HttpResponse.json({
                user: mockedCustomer,
                message: "User registered and logged in successfully",
            })
        }

        // Success case for admin user
        if (
            email === mockedAdminCredentials.email &&
            password === mockedAdminCredentials.password
        ) {
            return HttpResponse.json({
                user: mockedAdmin,
                message: "User registered and logged in successfully",
            })
        }

        // Error case
        return HttpResponse.json(
            {
                message: "Email already in use",
            },
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
            user: mockedCustomer,
        })
    }),
]
