import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

type Props = {
    subtotal: number
    shipping: number
    tax: number
}

export default function OrderSummary({ subtotal, shipping, tax }: Props) {
    const total = subtotal + shipping + tax

    return (
        <div className="space-y-6">
            {/* Promo Code */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Promo Code
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) =>
                                setPromoCode(e.target.value.toUpperCase())
                            }
                        />
                        <Button onClick={applyPromoCode} disabled={!promoCode}>
                            Apply
                        </Button>
                    </div>
                    {appliedPromo && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">
                                Code: {appliedPromo.code}
                            </span>
                            <span className="text-green-600">
                                -{appliedPromo.discount}%
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card> */}

            {/* Order Summary */}
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

                        {/* {appliedPromo && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({appliedPromo.code})</span>
                                <span>-${promoDiscount.toFixed(2)}</span>
                            </div>
                        )} */}

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

                    <Button size="lg" className="w-full" asChild>
                        <Link to="/checkout">Proceed to Checkout</Link>
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                        Secure checkout powered by Stripe
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
