import {
    addProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { queryKeys, type ProductsQuery } from "@/lib/query-keys"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRef, useState } from "react"

type ProductsData = {
    data: AdminProduct[]
    page: number
    perPage: number
    total: number | null
    totalPages: number | null
}

export default function useAdminProducts({
    queryParams = {},
    categories,
}: {
    queryParams?: ProductsQuery
    categories: AdminCategory[]
}) {
    const queryClient = useQueryClient()
    /// States
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<null | string>(null)

    const totalRef = useRef(0)
    const totalPagesRef = useRef(1)

    const { categoryId, ...params } = queryParams

    const finalQueryParams = {
        ...params,
        categoryId:
            categoryId === "__NULL__"
                ? "null" // for deleted categories
                : categories.find((c) => c.name === categoryId)?.id,
    }

    // Get Products
    const { data: { data: products = [] } = {}, isLoading } = useQuery({
        queryKey: queryKeys.products.admin(queryParams),
        queryFn: () => getProducts(finalQueryParams),
        select: (res) => {
            const totalPages = res.data.totalPages
            const total = res.data.total
            if (totalPages) {
                // set only on page 1 when totalPages exists
                totalPagesRef.current = totalPages
            }
            if (total) {
                totalRef.current = total
            }
            return res.data as ProductsData
        },
    })

    // Selected Product : for update-form initial data
    const selectedProduct = products.find((p) => p.id === selectedId)

    // Triggers
    function openEditDialog(id: string) {
        setSelectedId(id)
        setIsEditOpen(true)
    }

    function openDeleteDialog(id: string) {
        setSelectedId(id)
        setIsDeleteOpen(true)
    }

    // ADD
    const { mutateAsync: addMutation, isPending: isAdding } = useMutation({
        mutationFn: (data: FormData) => addProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            setIsAddOpen(false)
        },
    })

    async function handleAdd(data: FormData) {
        await addMutation(data)
    }

    // UPDATE
    const { mutateAsync: updateMutation, isPending: isUpdating } = useMutation({
        mutationFn: (data: FormData) => updateProduct(selectedId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            setIsEditOpen(false)
            setSelectedId(null)
        },
    })

    async function handleUpdate(data: FormData) {
        await updateMutation(data)
    }

    /// DELETE
    const { mutateAsync: deleteMutation, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteProduct(selectedId!),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            setIsDeleteOpen(false)
            setSelectedId(null)
        },
    })

    async function handleDelete() {
        await deleteMutation()
    }

    /// Table Products
    const tableProducts = products.map((product) => ({
        ...product,
        categoryName: categories.find((cat) => cat.id === product.categoryId)
            ?.name,
    }))

    return {
        triggers: {
            onUpdate: openEditDialog,
            onDelete: openDeleteDialog,
        },
        addForm: {
            open: isAddOpen,
            onOpenChange: setIsAddOpen,
            categories,
            title: "Add Product",
            description: "Add a new product to your inventory.",
            buttonText: "Add Product",
            onSubmit: handleAdd,
            isSubmitting: isAdding,
        },
        updateForm: {
            open: isEditOpen,
            onOpenChange: setIsEditOpen,
            categories,
            title: "Edit Product",
            description: "Update product information.",
            buttonText: "Update Product",
            onSubmit: handleUpdate,
            isSubmitting: isUpdating,
            initialData: selectedProduct,
        },
        confirm: {
            title: "Delete Product",
            description: `Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`,
            onConfirm: handleDelete,
            isLoading: isDeleting,
            open: isDeleteOpen,
            onOpenChange: setIsDeleteOpen,
        },
        isLoading,
        products: tableProducts,
        id: selectedId,
        total: totalRef.current,
        totalPages: totalPagesRef.current,
    }
}
