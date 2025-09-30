import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./redux/store.ts"
import { RouterProvider } from "react-router-dom"
import { router } from "./router.tsx"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { AuthProvider } from "./features/auth/components/auth-provider.tsx"

export const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
)
