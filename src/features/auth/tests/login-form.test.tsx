import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http, HttpResponse } from "msw"

import { LoginForm } from "../components/login-form"
import { AuthProvider } from "../components/auth-provider"
import {
    mockedAdminCredentials,
    mockedCustomer,
    mockedCustomerCredentials,
} from "./mocked-users"
import { server } from "@/tests/mocked-server"

// Mock navigation
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
})

// Test wrapper with all providers
function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>{children}</AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

afterEach(() => {
    vi.clearAllMocks()
})

describe("RegisterForm", () => {
    it("renders the login form correctly", () => {
        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        // Check form elements are present
        expect(screen.getByText("Sign in to your account")).toBeInTheDocument()
        expect(screen.getByLabelText("Email")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
        expect(
            screen.getByRole("button", { name: "Sign in" })
        ).toBeInTheDocument()

        // Check placeholders
        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toBeInTheDocument()
        expect(
            screen.getByPlaceholderText("Enter your password")
        ).toBeInTheDocument()
    })

    it("shows validation errors for empty fields", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // Try to submit empty form
        await user.click(signInButton)

        // Check for validation messages (these come from your zod schema)
        await waitFor(() => {
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
            expect(
                screen.getByText(/Password is required/i)
            ).toBeInTheDocument()
        })
    })

    it("prevents form submission with invalid email", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // Enter invalid email
        await user.type(emailInput, "invalid-email")
        await user.click(signInButton)

        // Form should not submit (no navigation)
        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled()
        })

        // Should still be on form page
        expect(screen.getByText("Sign in to your account")).toBeInTheDocument()
    })

    it("successfully login a regular user and navigates to profile", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // Fill form with valid data
        await user.type(emailInput, mockedCustomerCredentials.email)
        await user.type(passwordInput, mockedCustomerCredentials.password)

        // Submit form
        await user.click(signInButton)

        // Wait for successful registration and navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })

        // Should not show any error messages
        expect(
            screen.queryByText(/something went wrong/i)
        ).not.toBeInTheDocument()
    })

    it("successfully login an admin user and navigates to admin", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // Fill form with admin credentials
        await user.type(emailInput, mockedAdminCredentials.email)
        await user.type(passwordInput, mockedAdminCredentials.password)

        // Submit form
        await user.click(signInButton)

        // Wait for successful registration and navigation to admin
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/admin")
        })
    })

    it("shows error message when login fails", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // Use credentials that will trigger error
        await user.type(emailInput, "wrong@example.com")
        await user.type(passwordInput, "password123")

        // Submit form
        await user.click(signInButton)

        // Wait for error message to appear
        await waitFor(() => {
            expect(
                screen.getByText("Email or password is incorrect")
            ).toBeInTheDocument()
        })

        // Should not navigate anywhere on error
        expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("disables submit button during form submission", async () => {
        const user = userEvent.setup()

        // Override MSW to add delay to simulate slow network
        server.use(
            http.post("/api/auth/login", async () => {
                // Add delay to see loading state
                await new Promise((resolve) => setTimeout(resolve, 100))
                return HttpResponse.json({
                    user: mockedCustomer,
                    message: "User logged in successfully",
                })
            })
        )

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // Fill and submit form
        await user.type(emailInput, mockedCustomerCredentials.email)
        await user.type(passwordInput, mockedCustomerCredentials.password)
        await user.click(signInButton)

        // Button should be disabled during submission
        expect(signInButton).toBeDisabled()

        // Wait for form to complete
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })
    })

    it("shows fallback error message when no specific error is provided", async () => {
        const user = userEvent.setup()

        // Mock a generic error response
        server.use(
            http.post("/api/auth/login", () => {
                return HttpResponse.json(
                    { error: "Something went wrong" }, // error instead of message to trigger fallback
                    { status: 500 }
                )
            })
        )

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.click(signInButton)

        // Should show fallback error message
        await waitFor(() => {
            expect(
                screen.getByText("Something went wrong , Please try again.")
            ).toBeInTheDocument()
        })
    })

    it("login after a failure", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <LoginForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const signInButton = screen.getByRole("button", { name: "Sign in" })

        // First submission - should fail
        await user.type(emailInput, "existing@example.com")
        await user.type(passwordInput, "password123")
        await user.click(signInButton)

        // Wait for error
        await waitFor(() => {
            expect(
                screen.getByText("Email or password is incorrect")
            ).toBeInTheDocument()
        })

        // Clear form and try again with valid data
        await user.clear(emailInput)
        await user.clear(passwordInput)
        await user.type(emailInput, mockedCustomerCredentials.email)
        await user.type(passwordInput, mockedCustomerCredentials.password)
        await user.click(signInButton)

        // Should succeed and navigate
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })
    })
})
