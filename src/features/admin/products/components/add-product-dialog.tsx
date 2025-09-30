import { Plus } from "lucide-react"
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
import { useMutation } from "@tanstack/react-query"
import { addProduct } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import type { ChangeEvent } from "react"
import { generateSlug } from "@/utils/generate-slug"

const categories = ["Electronics", "Sports", "Home", "Clothing", "Books"]

type ProductImage = ProductFormData["images"][number]

export default function AddProductDialog() {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

                // Update the form state correctly and trigger validation (recommended)
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
    
    const mutation = useMutation({
        mutationFn: addProduct,
        onSuccess: (data) => {
            console.log("success data : ", data)
            queryClient.invalidateQueries({
                queryKey: ["admin-products", "products"],
            })
            form.reset()
        },
        onError: (err) => {
            console.log("error : ", err)
        },
    })

    const onSubmit = async (data: ProductFormData) => {
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
            formData.append(`images[${index}].file`, image.file)
            formData.append(`images[${index}].alt`, image.alt || "")
            formData.append(
                `images[${index}].isPrimary`,
                String(image.isPrimary)
            )
        })
        try {
            await mutation.mutateAsync(formData)
        } catch {
            // already handled
        }
    }

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        const newName = e.target.value
        form.setValue("name", newName, { shouldValidate: true })
        const slug = generateSlug(newName)
        form.setValue("slug", slug, { shouldValidate: true })
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button asChild>
                    <div>
                        <Plus />
                        Add Product
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your inventory.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {category}
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
                                disabled={form.formState.isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Add Product
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
