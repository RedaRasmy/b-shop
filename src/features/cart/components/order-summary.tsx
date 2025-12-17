import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
    subtotal: number
    shipping: number
    tax: number
    disabled?: boolean
}

export default function OrderSummary({
    subtotal,
    shipping,
    tax,
    disabled = false,
}: Props) {
    const total = subtotal + shipping + tax

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>
                                {shipping === 0
                                    ? "Free"
                                    : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>

                        {shipping > 0 && (
                            <div className="text-sm text-muted-foreground">
                                Add ${(50 - subtotal).toFixed(2)} more for free
                                shipping
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <Button size="lg" className="w-full" disabled={disabled}>
                        <Link to="/order">Proceed to Order</Link>
                    </Button>

                    <div className="flex items-center justify-center gap-2 font-semibold text-xs text-muted-foreground text-center">
                        <Package /> <span>Cach On Delivery</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
