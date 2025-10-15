import { useAuth } from "@/features/auth/use-auth"
import { CartHeader } from "@/features/cart/components/cart-header"
import { CartItems } from "@/features/cart/components/cart-items"
import { EmptyCart } from "@/features/cart/components/empty-cart"
import OrderSummary from "@/features/cart/components/order-summary"
import useCart from "@/features/cart/hooks/use-cart"
import LoadingPage from "@/pages/loading"

export default function CartPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

    const {
        isLoading,
        items,
        decrementQuantity,
        incrementQuantity,
        removeItem,
        subtotal,
    } = useCart(isAuthenticated)

    if (isAuthLoading || isLoading) return <LoadingPage />

    if (items.length === 0) return <EmptyCart />

    return (
        <div className="container mx-auto px-4 py-8">
            <CartHeader itemsNumber={5} />
            <div className="grid lg:grid-cols-3 gap-8">
                <CartItems
                    items={items}
                    onMinus={decrementQuantity}
                    onPlus={incrementQuantity}
                    onRemove={removeItem}
                />
                <OrderSummary shipping={0} tax={0} subtotal={subtotal} />
            </div>
        </div>
    )
}
