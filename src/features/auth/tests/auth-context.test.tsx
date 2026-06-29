import { describe, it, expect } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { AuthProvider } from "@/features/auth/components/auth-provider"
import { useAuth } from "@/features/auth/use-auth"
import type { ReactNode } from "react"
import { server } from "@/tests/mocked-server"
import { http, HttpResponse } from "msw"
import { mockedCustomer } from "./mocked-users"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { rootReducer } from "@/redux/store"
import { configureStore } from "@reduxjs/toolkit"

const getAuthResult = () => {
    const testQueryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    })
    const testStore = configureStore({ reducer: rootReducer })

    return renderHook(() => useAuth(), {
        wrapper: ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={testQueryClient}>
                <Provider store={testStore}>
                    <AuthProvider>{children}</AuthProvider>
                </Provider>
            </QueryClientProvider>
        ),
    }).result
}

describe("AuthContext", () => {
    it("should start with no user then auto login", async () => {
        const result = getAuthResult()

        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.user).toStrictEqual(mockedCustomer)
        expect(result.current.isAuthenticated).toBe(true)
    })

    it("should set user", async () => {
        const result = getAuthResult()

        act(() => {
            result.current.setUser(mockedCustomer)
        })

        expect(result.current.user).toEqual(mockedCustomer)
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.isLoading).toBe(false)
    })

    it("should logout and clear user state", async () => {
        const result = getAuthResult()

        // Set user first
        result.current.setUser(mockedCustomer)
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

        expect(result.current.user).toEqual(mockedCustomer)
    })

    it("should handle refreshUser failure", async () => {
        server.use(
            http.get("/api/me", () => HttpResponse.json({}, { status: 401 })),
        )

        const result = getAuthResult()

        await waitFor(() => {
            expect(result.current.user).toBeNull()
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.isLoading).toBe(false)
        })
    })
})
