import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import type { Address } from "@/features/profile/types"
import {
    AddressFormSchema,
    type AddressFormData,
} from "@/features/profile/validation"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    address?: Address
    onSubmit: (data: AddressFormData) => Promise<unknown>
    isSubmitting: boolean
    title: string
    description: string
    buttonText: string
    error?: string 
}

export function AddressFormDialog({
    open,
    onOpenChange,
    address,
    onSubmit,
    isSubmitting,
    title,
    description,
    buttonText,
    error,
}: Props) {
    const form = useForm({
        resolver: zodResolver(AddressFormSchema),
        defaultValues: address || {
            label: "Home",
            addressLine1: "",
            city: "",
            isDefault: false,
            postalCode: "",
        },
    })

    async function handleSubmit(data: AddressFormData) {
        try {
            await onSubmit(data)
            form.reset()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <p className="text-destructive">{error}</p>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Home">
                                                    Home
                                                </SelectItem>
                                                <SelectItem value="Work">
                                                    Work
                                                </SelectItem>
                                                <SelectItem value="Other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                        <FormField
                            control={form.control}
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
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex w-full gap-4 mt-6">
                                    <FormLabel>
                                        Set as default address
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            className="scale-[1.2]"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            defaultChecked={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {buttonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
