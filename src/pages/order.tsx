import { Form } from "@/components/ui/form"
import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { createOrder } from "@/features/order/api/requests"
import {
    OrderFormSchema,
    type OrderFormData,
} from "@/features/order/validation"
import Header from "@/features/order/components/header"
import OrderSummary from "@/features/order/components/order-summary"
import ContactInfos from "@/features/order/components/contact-infos"
import ShippingAddress from "@/features/order/components/shipping-address"
import { fetchMe, fetchAddresses } from "@/features/profile/requests"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { profileKeys } from "@/features/profile/query-keys"
import { cartKeys } from "@/features/cart/query-keys"

export default function OrderPage() {
    const { isAuthenticated } = useAuth()
    const { subtotal, items } = useCart(isAuthenticated)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    // get defaults
    const { data: profile } = useQuery({
        queryKey: profileKeys.me(),
        queryFn: fetchMe,
    })
    const { data: addresses } = useQuery({
        queryKey: profileKeys.addresses(),
        queryFn: fetchAddresses,
    })

    const defaultAddress = addresses?.find((ad) => ad.isDefault)

    const form = useForm({
        resolver: zodResolver(OrderFormSchema),
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

    const { mutateAsync, isPending, isError } = useMutation({
        mutationFn: createOrder,
        onSuccess: (token) => {
            queryClient.invalidateQueries({
                queryKey: cartKeys.base,
            })

            navigate("/order-success/" + token)
        },
    })

    const errorMessage = isError
        ? "Something went wrong , try again."
        : undefined

    async function submit(data: OrderFormData) {
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
            <Header />
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
                    <OrderSummary
                        isPending={isPending || items.length < 1}
                        orderItems={items}
                        subtotal={subtotal}
                        error={errorMessage}
                    />
                </form>
            </Form>
        </div>
    )
}
