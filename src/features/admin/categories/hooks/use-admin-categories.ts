import {
    addCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "@/features/admin/admin-requests"
import type {
    AdminCategory,
    CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { queryKeys, type CategoriesQuery } from "@/lib/query-keys"
import { queryClient } from "@/lib/query-client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"

export function useAdminCategories({
    queryParams,
}: {
    queryParams?: CategoriesQuery
}) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)

    const [selectedId, setSelectedId] = useState<string | null>(null)

    const { data: categories = [], isLoading } = useQuery({
        queryKey: queryKeys.categories.admin(queryParams),
        queryFn: () => getCategories(queryParams),
        select: (res) => {
            return res.data as AdminCategory[]
        },
    })

    const selectedCategory = categories.find((c) => c.id === selectedId)

    const { mutateAsync: addMutation, isPending: isAdding } = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            setIsAddOpen(false)
            setSelectedId(null)
        },
    })

    const handleAdd = async (data: CategoryFormData) => await addMutation(data)

    const { mutateAsync: deleteMutation, isPending: isDeleting } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            setIsDeleteOpen(false)
            setSelectedId(null)
        },
    })

    async function handleDelete() {
        await deleteMutation(selectedId!)
    }

    const { mutateAsync: updateMutation, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            setIsUpdateOpen(false)
            setSelectedId(null)
        },
    })

    const handleUpdate = async (data: CategoryFormData) =>
        await updateMutation({
            id: selectedId!,
            data,
        })

    return {
        select: setSelectedId,
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
        // dialogs
        isAddOpen,
        isUpdateOpen,
        isDeleteOpen,
        updateForm: {
            open: isUpdateOpen,
            onOpenChange: setIsUpdateOpen,
            title: "Edit Category",
            description: "Update category information.",
            buttonText: "Update Category",
            onSubmit: handleUpdate,
            isSubmitting: isUpdating,
            existingCategories: categories,
            initialData: selectedCategory,
        },
        addForm: {
            open: isAddOpen,
            onOpenChange: setIsAddOpen,
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
            open: isDeleteOpen,
            onOpenChange: setIsDeleteOpen,
        },
        triggers: {
            onDelete: (id: string) => {
                setSelectedId(id)
                setIsDeleteOpen(true)
            },
            onUpdate: (id: string) => {
                setSelectedId(id)
                setIsUpdateOpen(true)
            },
        },
    }
}
