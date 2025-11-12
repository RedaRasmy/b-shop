/* eslint-disable react-refresh/only-export-components */
import { AuthProvider } from "@/features/auth/components/auth-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import type { ComponentType, PropsWithChildren } from "react"
import { BrowserRouter } from "react-router-dom"

export function renderWithProviders(ui: React.ReactElement, options = {}) {
    const testQueryClient = new QueryClient()
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={testQueryClient}>
            <NuqsAdapter>
                <BrowserRouter>
                    <AuthProvider>{children}</AuthProvider>
                </BrowserRouter>
            </NuqsAdapter>
        </QueryClientProvider>
    )
    return render(ui, {
        wrapper: wrapper as ComponentType,
        ...options,
    })
}

function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        render: { ...renderWithProviders(jsx) },
    }
}

export const realAdminCredentials = {
    email: process.env.TEST_ADMIN_EMAIL!,
    password: process.env.TEST_ADMIN_PASSWORD!,
}

export * from "@testing-library/react"
export { setup }
