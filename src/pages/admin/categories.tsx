import { Button } from "@/components/ui/button"
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
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import CategoryList from "@/features/admin/categories/components/category-list"
import DataTableControls from "@/features/admin/components/data-table-controls"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useTableControls } from "@/features/admin/hooks/use-table-controls"
import { queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/main"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function AdminCategoriesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)

    const [selectedId, setSelectedId] = useState<string | null>(null)

    const {
        clearFilters,
        filters,
        queryParams,
        searchTerm,
        setFilter,
        setSearchTerm,
        setSort,
        sortBy,
        sortOrder,
    } = useTableControls()

    const filterOptions = [
        {
            label: "Status",
            value: "status",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ]

    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Status", value: "status" },
        { label: "Created Date", value: "createdAt" },
        { label: "Updated Date", value: "updatedAt" },
    ]

    const { data: categories = [] } = useQuery({
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

    const onSubmit = async (data: CategoryFormData) => await addMutation(data)

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

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Update and Delete Dialogs */}
            <CategoryForm
                key={selectedId}
                open={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
                title="Edit Category"
                description="Update category information."
                buttonText="Update Category"
                onSubmit={handleUpdate}
                isSubmitting={isUpdating}
                existingCategories={categories}
                initialData={selectedCategory}
            >
                <Button asChild>
                    <div>
                        <Plus />
                        Add Category
                    </div>
                </Button>
            </CategoryForm>
            <DeleteConfirmDialog
                title="Delete Category"
                description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
            {/* Page content */}
            <AdminPageHeader
                title="Categories"
                description={`Organize your products with categories (${categories.length} categories)`}
            >
                <CategoryForm
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    title="Add Category"
                    description="Add a new product category to organize your inventory."
                    buttonText="Add Category"
                    onSubmit={onSubmit}
                    isSubmitting={isAdding}
                    existingCategories={categories}
                >
                    <Button asChild>
                        <div>
                            <Plus />
                            Add Category
                        </div>
                    </Button>
                </CategoryForm>
            </AdminPageHeader>
            <DataTableControls
                activeFilters={filters}
                onClearFilters={clearFilters}
                sortBy={sortBy}
                filters={filterOptions}
                searchTerm={searchTerm}
                sortOptions={sortOptions}
                sortOrder={sortOrder}
                onFilterChange={setFilter}
                onSearchChange={setSearchTerm}
                onSortChange={setSort}
            />
            <CategoryList
                categories={categories}
                onDelete={(id) => {
                    setSelectedId(id)
                    setIsDeleteOpen(true)
                }}
                onUpdate={(id) => {
                    setSelectedId(id)
                    setIsUpdateOpen(true)
                }}
            />
        </div>
    )
}
