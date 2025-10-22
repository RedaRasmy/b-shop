import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartProduct } from "@/features/cart/types"
import { Shield, Truck } from "lucide-react"

type Props = {
    orderItems: CartProduct[]
    subtotal: number
    shippingCost?: number
    tax?: number
    isPending: boolean
}

export default function CheckoutOrderSummary({
    orderItems,
    shippingCost = 0,
    subtotal,
    tax = 0,
    isPending,
}: Props) {
    const total = subtotal + shippingCost + tax

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <img
                            src={item.thumbnailUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                            </p>
                            <p className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                            {shippingCost === 0
                                ? "Free"
                                : `$${shippingCost.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <Button
                    size="lg"
                    className="w-full"
                    type="submit"
                    disabled={isPending}
                >
                    Place Order
                </Button>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>Fast Delivery</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
