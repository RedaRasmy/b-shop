import {
    useState,
    useEffect,
    type ReactNode,
    useCallback,
    useMemo,
} from "react"
import { AuthContext } from "@/features/auth/auth-context"
import { logoutRequest } from "@/features/auth/auth-requests"
import { fetchMe } from "@/features/profile/profile-requests"
import type { User } from "@/features/auth/auth.validation"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const set = useCallback((user: User) => {
        setUser(user)
        setLoading(false)
    }, [])

    const logout = useCallback(async () => {
        try {
            await logoutRequest()
        } catch (err) {
            console.error("Logout failed", err)
        } finally {
            setUser(null)
        }
    }, [])

    const refreshUser = useCallback(async () => {
        try {
            const profile = await fetchMe()
            setUser(profile)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // On mount, try to refresh user automatically
        refreshUser()
    }, [refreshUser])

    const contextValue = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading: loading,
            logout,
            refreshUser,
            setUser: set,
        }),
        [user, loading, logout, refreshUser, set]
    )

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
