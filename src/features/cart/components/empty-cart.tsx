import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

export function EmptyCart() {
    return (
        <div className="h-full bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Button asChild>
                    <Link to="/products">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    )
}
