import { Form } from "@/components/ui/form"
import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { placeOrder } from "@/features/checkout/checkout-requests"
import {
    CheckoutFormSchema,
    type CheckoutFormData,
} from "@/features/checkout/checkout.validation"
import CheckoutHeader from "@/features/checkout/components/checkout-header"
import CheckoutOrderSummary from "@/features/checkout/components/checkout-order-summary"
import ContactInfos from "@/features/checkout/components/contact-infos"
import ShippingAddress from "@/features/checkout/components/shipping-address"
import { fetchMe, getAddresses } from "@/features/profile/profile-requests"
import { queryKeys } from "@/lib/query-keys"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export default function CheckoutPage() {
    const { isAuthenticated } = useAuth()
    const { subtotal, items } = useCart(isAuthenticated)
    const queryClient = useQueryClient()

    // get defaults
    const { data: profile } = useQuery({
        queryKey: queryKeys.profile,
        queryFn: fetchMe,
    })
    const { data: addresses } = useQuery({
        queryKey: queryKeys.addresses,
        queryFn: getAddresses,
    })

    const defaultAddress = addresses?.find((ad) => ad.isDefault)

    const form = useForm({
        resolver: zodResolver(CheckoutFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            postalCode: "",
        },
    })

    // Reset form with fetched data
    useEffect(() => {
        if (profile || defaultAddress) {
            form.reset({
                name: profile?.fullName || "",
                email: profile?.email || "",
                phone: profile?.phone ?? "",
                addressLine1: defaultAddress?.addressLine1 ?? "",
                city: defaultAddress?.city ?? "",
                postalCode: defaultAddress?.postalCode ?? "",
            })
        }
    }, [profile, defaultAddress, form])

    const { mutateAsync, isPending } = useMutation({
        mutationFn: placeOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.cart.base,
            })
        },
    })

    async function submit(data: CheckoutFormData) {
        try {
            await mutateAsync({
                ...data,
                items: items.map(({ quantity, id }) => ({
                    productId: id,
                    quantity,
                })),
            })
            form.reset()
        } catch (err) {
            console.error(err)
        }
    }

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
                        isPending={isPending || items.length < 1}
                        orderItems={items}
                        subtotal={subtotal}
                    />
                </form>
            </Form>
        </div>
    )
}
