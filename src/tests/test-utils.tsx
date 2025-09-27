/* eslint-disable react-refresh/only-export-components */
import { AuthProvider } from "@/features/auth/components/auth-provider"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ComponentType, PropsWithChildren } from "react"
import { BrowserRouter } from "react-router-dom"

export function RenderWithProviders(ui: React.ReactElement, options = {}) {
    const wrapper = ({ children }: PropsWithChildren) => (
        <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
    )
    return render(ui, {
        wrapper: wrapper as ComponentType,
        ...options,
    })
}

function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        render: { ...RenderWithProviders(jsx) },
    }
}

export * from "@testing-library/react"
export { setup }
