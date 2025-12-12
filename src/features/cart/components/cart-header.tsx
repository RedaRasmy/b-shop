import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export function CartHeader({ itemCount }: { itemCount: number }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" asChild>
                <Link to="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                </Link>
            </Button>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="not-md:hidden">{itemCount} items</Badge>
        </div>
    )
}
