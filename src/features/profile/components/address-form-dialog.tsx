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
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
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
                <p className="text-destructive">{error}</p>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    <Controller
                        name="label"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="address-type">
                                    Address Type
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id="address-type"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-full"
                                    >
                                        <SelectValue placeholder="Select a type" />
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
                            </Field>
                        )}
                    />
                    <Controller
                        name="city"
                        control={form.control}
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
                        control={form.control}
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

                    <Controller
                        name="addressLine1"
                        control={form.control}
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
                        name="isDefault"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                orientation={"horizontal"}
                            >
                                <FieldLabel htmlFor="is-default">
                                    Set as default address
                                </FieldLabel>
                                <Switch
                                    id="is-default"
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            className={"mt-2"}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {buttonText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
