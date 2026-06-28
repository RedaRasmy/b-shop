import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { OrderFormData } from "@/features/order/validation"
import type { Address } from "@/features/profile/types"
import { MapPin } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

export default function ShippingAddress({
    onSelectAddress,
    addresses,
}: {
    addresses: Address[]
    onSelectAddress: (id: string) => void
}) {
    const { control } = useFormContext<OrderFormData>()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                        2
                    </div>
                    <h1 className="text-xl">Shipping Address</h1>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {addresses.length > 0 && (
                    <div>
                        <Label htmlFor="savedAddress">
                            Select Saved Address
                        </Label>
                        <Select onValueChange={onSelectAddress}>
                            <SelectTrigger id="savedAddress">
                                <SelectValue placeholder="Choose from saved addresses" />
                            </SelectTrigger>
                            <SelectContent>
                                {addresses.map((addr) => (
                                    <SelectItem key={addr.id} value={addr.id}>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {addr.label} - {addr.addressLine1}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Controller
                    name="addressLine1"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="street-address">
                                Street Address
                            </FieldLabel>
                            <Input
                                {...field}
                                id="street-address"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="addressLine2"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="optional-address">
                                Apartment, suite, etc. (optional)
                            </FieldLabel>
                            <Input
                                {...field}
                                id="optional-address"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="city">City</FieldLabel>
                                <Input
                                    {...field}
                                    id="city"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="postalCode"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="postal-code">
                                    Postal Code
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="postal-code"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
