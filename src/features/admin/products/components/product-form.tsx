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
    ProductFormSchema,
    type ProductFormData,
} from "@/features/admin/products/products.validation"
import ImagesInput from "@/features/admin/products/components/images-input"
import type { ChangeEvent, ReactNode } from "react"
import { generateSlug } from "@/utils/generate-slug"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import axios from "axios"

type ProductImage = ProductFormData["images"][number]

type Props = {
    buttonText: string
    title: string
    description: string
    onSubmit: (data: FormData) => Promise<unknown>
    initialData?: ProductFormData
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
    initialData,
    onOpenChange,
    open,
    categories,
}: Props) {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            categoryId: "",
            status: "inactive",
            images: [],
        },
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
                form.setValue("images", finalImages ,{shouldValidate:true})
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
        // create FormData object
        const formData = new FormData()

        formData.append("name", data.name)
        formData.append("slug", data.slug)
        formData.append("description", data.description)
        formData.append("price", data.price.toString())
        formData.append("stock", data.stock.toString())
        formData.append("categoryId", data.categoryId)
        formData.append("status", data.status)
        // Add images
        data.images.forEach((image, index) => {
            if (image.file) {
                formData.append(`images[${index}].file`, image.file)
            } else {
                // EXISTING IMAGE - just send id
                formData.append(`images[${index}].id`, image.id!)
            }
            formData.append(`images[${index}].alt`, image.alt || "")
            formData.append(
                `images[${index}].isPrimary`,
                String(image.isPrimary)
            )
        })
        try {
            await onSubmit(formData)
            form.reset()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data.message || "Failed to save product"
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
        form.setValue("name", newName, { shouldValidate: true })
        const slug = generateSlug(newName)
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

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <div className="text-destructive">{error}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter product name"
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
                                        <FormLabel>URL Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="product-url-slug"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter product description"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
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
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a status" />
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
                        </div>

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Product Images (Max 5) *
                                    </FormLabel>
                                    <FormControl>
                                        <ImagesInput
                                            images={field.value}
                                            onChange={handleImageUpload}
                                            removeImage={removeImage}
                                            updateImageAlt={updateImageAlt}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
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
                </Form>
            </DialogContent>
        </Dialog>
    )
}
