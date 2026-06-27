import type { ProductFormData } from "@/features/products/validation"

export function buildFormData(data: ProductFormData) {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("slug", data.slug)
    formData.append("description", data.description)
    formData.append("price", data.price.toString())
    formData.append("stock", data.stock.toString())
    formData.append("categoryId", data.categoryId)
    formData.append("status", data.status)
    formData.append("isFeatured", String(data.isFeatured))

    // Add images
    data.images.forEach((image, index) => {
        if (image.file) {
            formData.append(`images[${index}].file`, image.file)
        } else {
            // EXISTING IMAGE - just send id
            formData.append(`images[${index}].id`, image.id!)
        }
        formData.append(`images[${index}].alt`, image.alt || "")
        formData.append(`images[${index}].isPrimary`, String(image.isPrimary))
    })

    return formData
}
