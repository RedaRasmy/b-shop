import { type AdminCategoriesQuery } from "@/features/categories/query-keys"
import type { CategoryFormData } from "@/features/categories/validation"
import { useAdminCategories } from "@/features/categories/api/queries"
import { useDialogs } from "@/features/admin/hooks/use-dialogs"
import {
    useCreateCategory,
    useDeleteCategory,
    useUpdateCategory,
} from "@/features/categories/api/mutations"

export function useCategoriesManager({
    queryParams,
}: {
    queryParams?: AdminCategoriesQuery
}) {
    const dialogs = useDialogs()

    const {
        data: categories = [],
        isLoading,
        isPlaceholderData,
    } = useAdminCategories(queryParams)

    const selectedCategory = categories.find(
        (c) => c.id === (dialogs.editingId || dialogs.deletingId)
    )

    /// CREATE

    const { mutateAsync: addMutation, isPending: isAdding } =
        useCreateCategory()

    const handleAdd = async (data: CategoryFormData) => {
        await addMutation(data)
        dialogs.reset()
    }

    /// UPDATE

    const { mutateAsync: updateMutation, isPending: isUpdating } =
        useUpdateCategory()

    const handleUpdate = async (data: CategoryFormData) => {
        await updateMutation({
            id: dialogs.editingId!,
            data,
        })
        dialogs.reset()
    }

    /// DELETE

    const { mutateAsync: deleteMutation, isPending: isDeleting } =
        useDeleteCategory()

    async function handleDelete() {
        await deleteMutation(dialogs.deletingId!)
        dialogs.reset()
    }

    return {
        category: selectedCategory,
        // actions
        categories,
        add: handleAdd,
        update: handleUpdate,
        remove: handleDelete,
        // loadings
        isLoading,
        isAdding,
        isUpdating,
        isDeleting,
        isPlaceholderData,
        // dialogs
        isAddOpen: dialogs.isAddOpen,
        isUpdateOpen: dialogs.isEditOpen,
        isDeleteOpen: dialogs.isDeleteOpen,
        updateForm: {
            open: dialogs.isEditOpen,
            onOpenChange: dialogs.closeEdit,
            title: "Edit Category",
            description: "Update category information.",
            buttonText: "Update Category",
            onSubmit: handleUpdate,
            isSubmitting: isUpdating,
            existingCategories: categories,
            initialData: selectedCategory,
        },
        addForm: {
            open: dialogs.isAddOpen,
            onOpenChange: dialogs.setAddingNew,
            title: "Add Category",
            description:
                "Add a new product category to organize your inventory.",
            buttonText: "Add Category",
            onSubmit: handleAdd,
            isSubmitting: isAdding,
            existingCategories: categories,
        },
        confirm: {
            title: "Delete Category",
            description: `Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`,
            onConfirm: handleDelete,
            isLoading: isDeleting,
            open: dialogs.isDeleteOpen,
            onOpenChange: dialogs.closeDelete,
        },
        triggers: {
            onUpdate: (id: string) => {
                dialogs.setEditingId(id)
            },
            onDelete: (id: string) => {
                dialogs.setDeletingId(id)
            },
        },
    }
}
