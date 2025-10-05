import { Button } from "@/components/ui/button"
import { addCategory, getCategories } from "@/features/admin/admin-requests"
import type {
    AdminCategory,
    CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import CategoryList from "@/features/admin/categories/components/category-list"
import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useTableControls } from "@/features/admin/hooks/use-table-controls"
import { queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/main"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function AdminCategoriesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false)
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

    const { mutateAsync, isPending } = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-categories"],
            })
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            setIsAddOpen(false)
        },
    })

    const onSubmit = async (data: CategoryFormData) => await mutateAsync(data)

    return (
        <div className="space-y-6 h-full flex flex-col">
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
                    isSubmitting={isPending}
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
            <CategoryList categories={categories} />
        </div>
    )
}
