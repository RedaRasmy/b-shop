import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http, HttpResponse } from "msw"

import { RegisterForm } from "../components/register-form"
import { AuthProvider } from "../components/auth-provider"
import {
    mockedAdminCredentials,
    mockedCustomer,
    mockedCustomerCredentials,
} from "./mocked-users"
import { server } from "@/tests/mocked-server"
import { Provider } from "react-redux"
import { store } from "@/redux/store"

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
            <Provider store={store}>
                <BrowserRouter>
                    <AuthProvider>{children}</AuthProvider>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    )
}

afterEach(() => {
    vi.clearAllMocks()
})

describe("RegisterForm", () => {
    it("renders the register form correctly", () => {
        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        // Check form elements are present
        expect(screen.getByText("Create new account")).toBeInTheDocument()
        expect(screen.getByLabelText("Email")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
        expect(
            screen.getByRole("button", { name: "Register" })
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
                <RegisterForm />
            </TestWrapper>
        )

        const registerButton = screen.getByRole("button", { name: "Register" })

        // Try to submit empty form
        await user.click(registerButton)

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
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const registerButton = screen.getByRole("button", { name: "Register" })

        // Enter invalid email
        await user.type(emailInput, "invalid-email")
        await user.click(registerButton)

        // Form should not submit (no navigation)
        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled()
        })

        // Should still be on form page
        expect(screen.getByText("Create new account")).toBeInTheDocument()
    })

    it("successfully registers a regular user and navigates to profile", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const registerButton = screen.getByRole("button", { name: "Register" })

        // Fill form with valid data
        await user.type(emailInput, mockedCustomerCredentials.email)
        await user.type(passwordInput, mockedCustomerCredentials.password)

        // Submit form
        await user.click(registerButton)

        // Wait for successful registration and navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })

        // Should not show any error messages
        expect(
            screen.queryByText(/something went wrong/i)
        ).not.toBeInTheDocument()
    })

    it("successfully registers an admin user and navigates to admin", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const registerButton = screen.getByRole("button", { name: "Register" })

        // Fill form with admin credentials
        await user.type(emailInput, mockedAdminCredentials.email)
        await user.type(passwordInput, mockedAdminCredentials.password)

        // Submit form
        await user.click(registerButton)

        // Wait for successful registration and navigation to admin
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/admin")
        })
    })

    it("shows error message when registration fails", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const registerButton = screen.getByRole("button", { name: "Register" })

        // Use credentials that will trigger error
        await user.type(emailInput, "existing@example.com")
        await user.type(passwordInput, "password123")

        // Submit form
        await user.click(registerButton)

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText("Email already in use")).toBeInTheDocument()
        })

        // Should not navigate anywhere on error
        expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("disables submit button during form submission", async () => {
        const user = userEvent.setup()

        // Override MSW to add delay to simulate slow network
        server.use(
            http.post("/api/auth/register", async () => {
                // Add delay to see loading state
                await new Promise((resolve) => setTimeout(resolve, 100))
                return HttpResponse.json({
                    user: mockedCustomer,
                    message: "User registered and logged in successfully",
                })
            })
        )

        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const registerButton = screen.getByRole("button", { name: "Register" })

        // Fill and submit form
        await user.type(emailInput, mockedCustomerCredentials.email)
        await user.type(passwordInput, mockedCustomerCredentials.password)
        await user.click(registerButton)

        // Button should be disabled during submission
        expect(registerButton).toBeDisabled()

        // Wait for form to complete
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })
    })

    it("shows fallback error message when no specific error is provided", async () => {
        const user = userEvent.setup()

        // Mock a generic error response
        server.use(
            http.post("/api/auth/register", () => {
                return HttpResponse.json(
                    { error: "Something went wrong" },
                    { status: 500 }
                )
            })
        )

        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const registerButton = screen.getByRole("button", { name: "Register" })

        await user.type(emailInput, "test@example.com")
        await user.type(passwordInput, "password123")
        await user.click(registerButton)

        // Should show fallback error message
        await waitFor(() => {
            expect(
                screen.getByText("Something went wrong , Please try again.")
            ).toBeInTheDocument()
        })
    })

    it("register after a failure", async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <RegisterForm />
            </TestWrapper>
        )

        const emailInput = screen.getByLabelText("Email")
        const passwordInput = screen.getByLabelText("Password")
        const registerButton = screen.getByRole("button", { name: "Register" })

        // First submission - should fail
        await user.type(emailInput, "existing@example.com")
        await user.type(passwordInput, "password123")
        await user.click(registerButton)

        // Wait for error
        await waitFor(() => {
            expect(screen.getByText("Email already in use")).toBeInTheDocument()
        })

        // Clear form and try again with valid data
        await user.clear(emailInput)
        await user.clear(passwordInput)
        await user.type(emailInput, mockedCustomerCredentials.email)
        await user.type(passwordInput, mockedCustomerCredentials.password)
        await user.click(registerButton)

        // Should succeed and navigate
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile")
        })
    })
})
