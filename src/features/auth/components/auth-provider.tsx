import { useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { AuthContext } from "@/features/auth/auth-context"
import { fetchMe, logoutRequest } from "@/features/auth/auth-requests"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const isAuthenticated = !!user

    const logout = async () => {
        try {
            await logoutRequest()
        } catch (err) {
            console.error("Logout failed", err)
        } finally {
            setUser(null)
        }
    }

    const refreshUser = async () => {
        try {
            const { data } = await fetchMe()
            setUser(data.user)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // On mount, try to refresh user automatically
        refreshUser()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading: loading,
                logout,
                refreshUser,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
