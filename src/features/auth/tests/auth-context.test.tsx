import { describe, it, expect } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { AuthProvider } from "@/features/auth/components/auth-provider"
import { useAuth } from "@/features/auth/use-auth"
import type { ReactNode } from "react"
import { mockedServer } from "@/tests/mock/mocked-server"
import { http, HttpResponse } from "msw"

const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
)

const mockedUser = {
    id: "test-id",
    email: "test@example.com",
    role: "admin" as "admin" | "customer",
    isEmailVerified: false,
}

const getAuthResult = () => renderHook(useAuth, { wrapper }).result

describe("AuthContext", () => {
    it("should start with no user then auto login", async () => {
        const result = getAuthResult()

        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.user).toStrictEqual(mockedUser)
            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.isLoading).toBe(false)
        })
    })

    it("should set user", async () => {
        const result = getAuthResult()

        act(() => {
            result.current.setUser(mockedUser)
        })

        expect(result.current.user).toEqual(mockedUser)
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.isLoading).toBe(false)
    })

    it("should logout and clear user state", async () => {
        const result = getAuthResult()

        // Set user first
        result.current.setUser(mockedUser)
        // Then logout
        await act(async () => {
            await result.current.logout()
        })

        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.isLoading).toBe(false)
    })

    it("should refresh user", async () => {
        const result = getAuthResult()

        await act(async () => {
            await result.current.refreshUser()
        })

        expect(result.current.user).toEqual(mockedUser)
    })

    it("should handle refreshUser failure", async () => {
        mockedServer.use(
            http.get("/api/auth/me", () =>
                HttpResponse.json({}, { status: 401 })
            )
        )

        const result = getAuthResult()

        await waitFor(() => {
            expect(result.current.user).toBeNull()
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.isLoading).toBe(false)
        })
    })
})
