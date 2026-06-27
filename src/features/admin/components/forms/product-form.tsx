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
    FieldError,
    FieldContent,
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
import ImagesInput from "@/features/admin/components/forms/images-input"
import type { ChangeEvent, ReactNode } from "react"
import axios from "axios"
import { createSlug } from "@/lib/slugify"
import type { AdminCategory } from "@/features/categories/types"
import {
    ProductFormSchema,
    type ProductFormData,
} from "@/features/products/validation"
import { Checkbox } from "@/components/ui/checkbox"

type ProductImage = ProductFormData["images"][number]

// categoryId can be undefined if its category have been deleted
// type InitialData = Prettify<
//     Omit<ProductFormData, "categoryId"> & { categoryId: string | null }
// >

const EMPTY_PRODUCT_VALUES: ProductFormData = {
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    status: "inactive",
    images: [],
    isFeatured: false,
}

type Props = {
    buttonText: string
    title: string
    description: string
    onSubmit: (data: ProductFormData) => Promise<unknown>
    defaultValues?: ProductFormData
    isSubmitting: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
    children?: ReactNode
    categories: AdminCategory[]
}

export default function ProductForm({
    buttonText,
    description,
    isSubmitting,
    onSubmit,
    title,
    children,
    defaultValues = EMPTY_PRODUCT_VALUES,
    onOpenChange,
    open,
    categories,
}: Props) {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues,
    })

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const images = form.getValues("images")
        if (images.length + files.length > 5) {
            return
        }

        // Convert each file reading process into a Promise
        const filePromises = files.map((file, index) => {
            return new Promise<ProductImage>((resolve) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const imageUrl = event.target?.result as string

                    // Determine if this image should be primary
                    // It is primary if NO images (existing or current) have been processed yet
                    const isPrimary = images.length === 0 && index === 0

                    resolve({
                        url: imageUrl,
                        alt: "",
                        isPrimary,
                        file,
                    })
                }
                reader.readAsDataURL(file)
            })
        })

        // Wait for all files to be read, then update the form state ONCE
        Promise.all(filePromises)
            .then((newImages) => {
                const finalImages = [...images, ...newImages]
                form.setValue("images", finalImages, { shouldValidate: true })
            })
            .catch((error) => {
                console.error("Error reading files:", error)
            })
    }

    const removeImage = (index: number) => {
        const images = form.getValues("images")
        const newImages = images.filter((_, i) => i !== index)
        form.setValue("images", newImages)
    }

    const updateImageAlt = (index: number, alt: string) => {
        const newImages = [...form.getValues("images")]
        newImages[index] = { ...newImages[index], alt }
        form.setValue("images", newImages)
    }

    const handleSubmit = async (data: ProductFormData) => {
        try {
            await onSubmit(data)
            form.reset()
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data.message
                : "An unexpected error occurred"
            form.setError("root", { message })
        }
    }

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        const newName = e.target.value
        form.setValue("name", newName, { shouldValidate: true })
        const slug = createSlug(newName)
        form.setValue("slug", slug, { shouldValidate: true })
    }

    const error = form.formState.errors.root?.message

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    <div className="text-destructive">{error}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-name">
                                        Product Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter product name"
                                        onChange={handleNameChange}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="slug"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-slug">
                                        URL Slug
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-slug"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="product-url-slug"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="product-description">
                                    Description
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    id="product-description"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter product description"
                                    className="min-h-[80px]"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-price">
                                        Price ($)
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-price"
                                        aria-invalid={fieldState.invalid}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="stock"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="product-stock">
                                        Stock
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-stock"
                                        aria-invalid={fieldState.invalid}
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Controller
                            name="categoryId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    orientation="responsive"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldContent>
                                        <FieldLabel htmlFor="product-category">
                                            Category
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
                                            id="product-category"
                                            aria-invalid={fieldState.invalid}
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            {categories?.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                    </div>

                    <Controller
                        name="images"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                    Product Images (Max 5) *
                                </FieldLabel>
                                <ImagesInput
                                    images={field.value}
                                    onChange={handleImageUpload}
                                    removeImage={removeImage}
                                    updateImageAlt={updateImageAlt}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="isFeatured"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="flex gap-2 items-center">
                                    <Checkbox
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked)
                                        }}
                                    />
                                    Featured
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {buttonText}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
