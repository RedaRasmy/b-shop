import { createContext } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: User) => void
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
