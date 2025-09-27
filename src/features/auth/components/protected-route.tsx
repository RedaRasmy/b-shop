import { useAuth } from "@/features/auth/use-auth"
import LoadingPage from "@/pages/loading"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

type ProtectedRouteProps = {
    children: ReactNode
    authFallback?: string
    roleFallback?: string
    requiredRole?: "admin" | "customer"
}

export const ProtectedRoute = ({
    children,
    authFallback = "/auth/login",
    roleFallback = "/profile",
    requiredRole,
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) return <LoadingPage />

    if (!isAuthenticated || !user) {
        return <Navigate to={authFallback} replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={roleFallback} replace />
    }

    return children
}
