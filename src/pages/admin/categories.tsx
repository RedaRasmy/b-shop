import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import CategoryList from "@/features/admin/categories/components/category-list"
import { useAdminCategories } from "@/features/admin/categories/hooks/use-admin-categories"
import DataTableControls from "@/features/admin/components/data-table-controls"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useTableControls } from "@/features/admin/hooks/use-table-controls"
import { Plus } from "lucide-react"

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

    const { categories, category, addForm, updateForm, confirm, triggers } =
        useAdminCategories({ queryParams })

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Update and Delete Dialogs */}
            <CategoryForm
                key={"update-form-dialog" + category?.id}
                {...updateForm}
            />
            <DeleteConfirmDialog
                key={"delete-confirm-dialog" + category?.id}
                {...confirm}
            />
            {/* Page content */}
            <AdminPageHeader
                title="Categories"
                description={`Organize your products with categories (${categories.length} categories)`}
            >
                <CategoryForm {...addForm}>
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
            <CategoryList categories={categories} {...triggers} />
        </div>
    )
}
