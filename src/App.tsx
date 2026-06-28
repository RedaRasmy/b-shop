import { Link, NavLink, Outlet } from "react-router-dom"
import { useAuth } from "./features/auth/use-auth"
import { Button } from "./components/ui/button"
import { User } from "lucide-react"
import { cn } from "./lib/utils"
import CartButton from "@/features/cart/components/cart-button"

export default function App() {
    const { user, isAuthenticated } = useAuth()
    const isAdmin = user && user.role === "admin"

    return (
        <div className="h-screen w-full">
            <nav className="flex items-center h-15 justify-between border-b border-black/10 px-2 lg:px-4">
                <div className="flex items-center gap-4 sm:gap-8">
                    <NavLink
                        to="/"
                        className={() =>
                            cn("font-extrabold text-accent text-xl")
                        }
                    >
                        B-Shop
                    </NavLink>
                    <NavLink
                        to="/products"
                        end
                        className={({ isActive }) =>
                            cn(
                                "hover:text-accent font-semibold",
                                isActive && "text-accent",
                            )
                        }
                    >
                        Products
                    </NavLink>
                </div>
                <div className="flex items-center md:gap-5 gap-3.5">
                    <CartButton />
                    {!isAuthenticated ? (
                        <div className="flex gap-1 md:gap-2 ">
                            <Button asChild className="not-sm:hidden">
                                <Link to="/auth/register">Register</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/auth/login">Sign in</Link>
                            </Button>
                        </div>
                    ) : isAdmin ? (
                        <Button asChild>
                            <Link to="/admin">Admin</Link>
                        </Button>
                    ) : (
                        <Button variant={"ghost"} asChild size={"default"}>
                            <Link to="/profile">
                                <User />
                            </Link>
                        </Button>
                    )}
                </div>
            </nav>
            <main className="h-[calc(100%-3.75rem)] overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}
