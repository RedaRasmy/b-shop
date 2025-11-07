import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./redux/store.ts"
import { RouterProvider } from "react-router-dom"
import { router } from "./router.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./features/auth/components/auth-provider.tsx"
import { queryClient } from "@/lib/query-client.ts"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Provider store={store}>
                    <NuqsAdapter>
                        <RouterProvider router={router} />
                    </NuqsAdapter>
                </Provider>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
)
