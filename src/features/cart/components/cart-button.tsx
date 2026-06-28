import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/use-auth"
import useCartManager from "@/features/cart/hooks/use-cart-manager"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

export default function CartButton() {
    const { isAuthenticated } = useAuth()
    const { itemCount } = useCartManager(isAuthenticated)

    return (
        <Button asChild variant={"ghost"} size={"icon"} className="relative">
            <Link to="/cart">
                <ShoppingCart className="size-4.5" />
                {itemCount > 0 && (
                    <span className="absolute -top-1 font-mono -right-1 text-xs text-white bg-destructive rounded-full size-4.5 flex items-center justify-center ">
                        {itemCount}
                    </span>
                )}
            </Link>
        </Button>
    )
}
