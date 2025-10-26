import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { OrderFormData } from "@/features/order/order.validation"
import type { Address } from "@/features/profile/profile.validation"
import { MapPin } from "lucide-react"
import { useFormContext } from "react-hook-form"

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

                <FormField
                    control={control}
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Apartment, suite, etc. (optional)
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
