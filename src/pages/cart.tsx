import { CartHeader } from "@/features/cart/components/cart-header"
import { CartItems } from "@/features/cart/components/cart-items"
import { EmptyCart } from "@/features/cart/components/empty-cart"
import OrderSummary from "@/features/cart/components/order-summary"

export default function CartPage() {

    const items = []

    if (items.length === 0) return <EmptyCart/>

    return (
        <div className="container mx-auto px-4 py-8">
            <CartHeader itemsNumber={5} />
            <div className="grid lg:grid-cols-3 gap-8">
                <CartItems
                    items={[]}
                    onMinus={() => {}}
                    onPlus={() => {}}
                    onRemove={() => {}}
                />
                <OrderSummary shipping={0} tax={0} subtotal={500} />
            </div>
        </div>
    )
}
