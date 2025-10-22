import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function CheckoutHeader() {
    return (
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" asChild>
                <Link to="/cart">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <Badge variant="secondary" className="not-sm:hidden">Secure Checkout</Badge>
        </div>
    )
}
