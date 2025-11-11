import { type AdminProductsQuery } from "@/features/products/query-keys"
import type { AdminCategory } from "@/features/categories/types"
import { useAdminProducts } from "@/features/products/api/queries"
import {
    useCreateProduct,
    useDeleteProduct,
    useUpdateProduct,
} from "@/features/products/api/mutations"
import { useDialogs } from "@/features/admin/hooks/use-dialogs"
import type { RenameKey } from "@/types/global-types"

export default function useProductsManager({
    queryParams = {},
    categories,
}: {
    queryParams?: RenameKey<AdminProductsQuery, "categoryId", "category">
    categories: AdminCategory[]
}) {
    const dialogs = useDialogs()

    const { category, ...params } = queryParams

    const finalQueryParams = {
        ...params,
        categoryId:
            category === "__NULL__"
                ? "__NULL__" // for deleted categories
                : categories.find((c) => c.slug === category)?.id,
    }

    // Get Products
    const { data, isLoading, isPlaceholderData } =
        useAdminProducts(finalQueryParams)

    const products = data?.data || []

    // Selected Product : for update-form initial data
    const selectedProduct = products.find(
        (p) => p.id === (dialogs.editingId || dialogs.deletingId)
    )

    // CREATE
    const { mutateAsync: addMutation, isPending: isAdding } = useCreateProduct()

    async function handleAdd(data: FormData) {
        await addMutation(data)
        dialogs.reset()
    }

    // UPDATE
    const { mutateAsync: updateMutation, isPending: isUpdating } =
        useUpdateProduct()

    async function handleUpdate(data: FormData) {
        if (!dialogs.editingId) return
        await updateMutation({
            id: dialogs.editingId,
            data,
        })
        dialogs.reset()
    }

    /// DELETE
    const { mutateAsync: deleteMutation, isPending: isDeleting } =
        useDeleteProduct()

    async function handleDelete() {
        if (!dialogs.deletingId) return

        await deleteMutation(dialogs.deletingId)
        dialogs.reset()
    }

    const initialData = selectedProduct
        ? {
              ...selectedProduct,
              price: Number(selectedProduct?.price),
          }
        : undefined

    return {
        triggers: {
            onUpdate: dialogs.setEditingId,
            onDelete: dialogs.setDeletingId,
        },
        addForm: {
            open: dialogs.isAddOpen,
            onOpenChange: dialogs.setAddingNew,
            categories,
            title: "Add Product",
            description: "Add a new product to your inventory.",
            buttonText: "Add Product",
            onSubmit: handleAdd,
            isSubmitting: isAdding,
        },
        updateForm: {
            open: dialogs.isEditOpen,
            onOpenChange: dialogs.closeEdit,
            categories,
            title: "Edit Product",
            description: "Update product information.",
            buttonText: "Update Product",
            onSubmit: handleUpdate,
            isSubmitting: isUpdating,
            initialData,
        },
        confirm: {
            title: "Delete Product",
            description: `Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`,
            onConfirm: handleDelete,
            isLoading: isDeleting,
            open: dialogs.isDeleteOpen,
            onOpenChange: dialogs.closeDelete,
        },
        isLoading,
        products,
        updatingId: dialogs.editingId,
        deletingId: dialogs.deletingId,
        total: data?.total,
        totalPages: data?.totalPages,
        isPlaceholderData,
    }
}
