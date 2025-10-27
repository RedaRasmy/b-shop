import { useForm } from "react-hook-form"
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
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
import {
    CategoryFormSchema,
    type AdminCategory,
    type CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import type { ChangeEvent, ReactNode } from "react"
import axios from "axios"
import { createSlug } from "@/lib/slugify"

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
                name.toLowerCase() !== initialData?.name?.toLowerCase()
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
            ({ slug }) => slug === newSlug && slug !== initialData?.slug
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
            ({ slug }) => slug === newSlug && slug !== initialData?.slug
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

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <div className="text-destructive">{error}</div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter category name"
                                            {...field}
                                            onChange={handleNameChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="category-slug"
                                            {...field}
                                            onChange={handleSlugChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter category description"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
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
                </Form>
            </DialogContent>
        </Dialog>
    )
}
