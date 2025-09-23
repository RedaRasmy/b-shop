import { createContext } from "react";
import type { User } from "./types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading : boolean
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);