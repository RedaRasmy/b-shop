import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { ChangeEvent, ReactNode } from "react"
import axios from "axios"
import { createSlug } from "@/lib/slugify"
import {
    CategoryFormSchema,
    type CategoryFormData,
} from "@/features/categories/validation"
import type { AdminCategory } from "@/features/categories/types"

type Props = {
    buttonText: string
    title: string
    description: string
    onSubmit: (data: CategoryFormData) => Promise<unknown>
    initialData?: CategoryFormData
    isSubmitting: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
    children?: ReactNode
    existingCategories?: AdminCategory[]
}
export function CategoryForm({
    buttonText,
    description,
    onSubmit,
    title,
    initialData,
    isSubmitting,
    children,
    onOpenChange,
    open,
    existingCategories = [],
}: Props) {
    const form = useForm<CategoryFormData>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            slug: "",
            status: "inactive",
        },
    })

    async function handleSubmit(data: CategoryFormData) {
        try {
            await onSubmit(data)
            form.reset()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data.messsage || "Failed to save category"
                form.setError("root", {
                    message,
                })
            } else {
                form.setError("root", {
                    message: "An unexpected error occurred",
                })
            }
        }
    }

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        const newName = e.target.value

        // Check if name exists (excluding current category in edit mode)
        const nameExists = existingCategories.some(
            ({ name }) =>
                name.toLowerCase() === newName.toLowerCase() &&
                name.toLowerCase() !== initialData?.name?.toLowerCase(),
        )

        if (nameExists) {
            form.setValue("name", newName, { shouldValidate: false })
            form.setError("name", {
                message: "This category name is already in use",
            })
        } else {
            form.setValue("name", newName, { shouldValidate: true })
        }

        /// Generate default slug
        const newSlug = createSlug(newName)

        // Check if slug exists (excluding current category in edit mode)
        const slugExists = existingCategories.some(
            ({ slug }) => slug === newSlug && slug !== initialData?.slug,
        )
        if (slugExists) {
            form.setValue("slug", newSlug, { shouldValidate: false })
            form.setError("slug", {
                message: "This slug is already in use",
            })
        } else {
            form.setValue("slug", newSlug, { shouldValidate: true })
        }
    }

    function handleSlugChange(e: ChangeEvent<HTMLInputElement>) {
        const newSlug = e.target.value
        // Check if slug exists (excluding current category in edit mode)
        const slugExists = existingCategories.some(
            ({ slug }) => slug === newSlug && slug !== initialData?.slug,
        )
        if (slugExists) {
            form.setValue("slug", newSlug, { shouldValidate: false })
            form.setError("slug", {
                message: "This slug is already in use",
            })
        } else {
            form.setValue("slug", newSlug, { shouldValidate: true })
        }
    }

    const error = form.formState.errors.root?.message

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    <div className="text-destructive">{error}</div>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="category-name">
                                    Category Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="category-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter category name"
                                    onChange={handleNameChange}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="slug"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="category-slug">
                                    Slug
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="category-slug"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="category-slug"
                                    onChange={handleSlugChange}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="category-description">
                                    Description
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter category description"
                                    className="min-h-[80px]"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="status"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                orientation="responsive"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldContent>
                                    <FieldLabel htmlFor="product-status">
                                        Status
                                    </FieldLabel>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id="product-status"
                                        aria-invalid={fieldState.invalid}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <DialogClose>
                            <Button asChild type="button" variant="outline">
                                <div>Cancel</div>
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {buttonText}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
