import { getCategories } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import { AddCategoryDialog } from "@/features/admin/categories/components/add-category-dialog"
import CategoryList from "@/features/admin/categories/components/category-list"
import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useTableControls } from "@/features/admin/hooks/use-table-controls"
import { useQuery } from "@tanstack/react-query"

export default function AdminCategoriesPage() {
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
            type: "select" as const,
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

    const { data } = useQuery({
        queryKey: ["admin-categories", queryParams],
        queryFn: () => getCategories(queryParams),
        select: (res) => {
            return res.data as AdminCategory[]
        },
    })

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Categories"
                description={`Organize your products with categories (${
                    data?.length || 0
                } categories)`}
            >
                <AddCategoryDialog />
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
            <CategoryList categories={data || []} />
        </div>
    )
}
