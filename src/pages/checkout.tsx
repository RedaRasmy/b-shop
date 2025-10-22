import { Form } from "@/components/ui/form"
import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { CheckoutFormSchema } from "@/features/checkout/checkout.validation"
import CheckoutHeader from "@/features/checkout/components/checkout-header"
import CheckoutOrderSummary from "@/features/checkout/components/checkout-order-summary"
import ContactInfos from "@/features/checkout/components/contact-infos"
import ShippingAddress from "@/features/checkout/components/shipping-address"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export default function CheckoutPage() {
    const { isAuthenticated } = useAuth()
    const { subtotal, items } = useCart(isAuthenticated)

    // get defaults

    const form = useForm({
        resolver: zodResolver(CheckoutFormSchema),
        defaultValues: {},
    })

    async function submit() {}

    return (
        <div className="container mx-auto px-4 py-8 2xl:px-40">
            <CheckoutHeader />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submit)}
                    className="grid lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-6">
                        <ContactInfos />
                        <ShippingAddress
                            addresses={[]}
                            onSelectAddress={() => {}}
                        />
                    </div>
                    <CheckoutOrderSummary
                        isPending={false}
                        orderItems={items}
                        subtotal={subtotal}
                    />
                </form>
            </Form>
        </div>
    )
}
