import { describe, it, expect } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { AuthProvider } from "@/components/auth-provider"
import { useAuth } from "@/hooks/use-auth"
import { loginRequest } from "@/api/auth-requests"
import type { ReactNode } from "react"
import type { AxiosError } from "axios"

const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
)

describe("AuthContext", () => {
    it("should start with no user", () => {
        const { result } = renderHook(() => useAuth(), { wrapper })

        expect(result.current.user).toBeNull()
        // expect(result.current.loading).toBe(false)
    })

    it("should login successfully with valid credentials", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            const res = await loginRequest({
                email: "test@example.com",
                password: "password123",
            })
            result.current.login(res.data.user)
        })

        await waitFor(() => {
            expect(result.current.user).toEqual({
                id: "test-id",
                email: "test@example.com",
                role: "admin",
                isEmailVerified: false,
            })
        })
    })

    it("should handle login errors", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper })

        await act(async () => {
            try {
                const res = await loginRequest({
                    email: "wrong@email.com",
                    password: "wrong-password",
                })
                result.current.login(res.data.user)
            } catch (error) {
                const data = (error as AxiosError).response?.data as {
                    message: string
                }
                expect(data.message).toContain("Email or password is incorrect")
            }
        })

        expect(result.current.user).toBeNull()
    })

    it("should logout and clear user state", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper })

        // Login first
        result.current.login({
            id: "test-id",
            email: "test@example.com",
            role: "admin",
            isEmailVerified: false,
        })
        // Then logout
        await act(async () => {
            await result.current.logout()
        })

        expect(result.current.user).toBeNull()
    })
})
