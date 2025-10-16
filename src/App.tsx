import { Link, NavLink, Outlet } from "react-router-dom"
import { useAuth } from "./features/auth/use-auth"
import { Button } from "./components/ui/button"
import {  ShoppingCart, User } from "lucide-react"
import { cn } from "./lib/utils"
import useCart from "@/features/cart/hooks/use-cart"

export default function App() {
    const { user, isAuthenticated } = useAuth()
    const isAdmin = user && user.role === "admin"

    const { itemCount } = useCart(isAuthenticated)

    return (
        <div className="h-screen w-full">
            <nav className="flex items-center h-15 justify-between border-b border-black/10 px-2 lg:px-4">
                <div className="flex space-x-6 items-center">
                    <NavLink
                        to="/"
                        className={() =>
                            cn("font-extrabold text-accent text-xl mr-8")
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
                                isActive && "text-accent"
                            )
                        }
                    >
                        Products
                    </NavLink>
                </div>
                <div className="flex items-center gap-5">
                    <Button
                        asChild
                        variant={"ghost"}
                        size={"default"}
                        className="relative"
                    >
                        <Link to="/cart">
                            <ShoppingCart className="size-4.5" />
                            <span className="absolute -top-1 -right-1 text-xs text-white bg-destructive rounded-full size-4 flex items-center justify-center ">
                                {itemCount}
                            </span>
                        </Link>
                    </Button>
                    {!isAuthenticated ? (
                        <div className="flex gap-2 ">
                            <Button asChild>
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
