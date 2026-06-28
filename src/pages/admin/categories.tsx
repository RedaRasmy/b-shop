import CategoriesTable from "@/features/admin/components/tables/categories-table"
import AdminPageHeader from "@/features/admin/components/page-header"
import useFilters from "@/features/admin/hooks/use-filters"
import Filters from "@/features/admin/components/filter-controls"
import { getOptions } from "@/features/admin/components/filter-controls/get-options"
import { CreateCategoryDialog } from "@/features/admin/components/create-category-dialog"
import { useState } from "react"
import type { AdminCategory } from "@/features/categories/types"
import { EditCategoryDialog } from "@/features/admin/components/edit-category-dialog"
import { DeleteCategoryDialog } from "@/features/admin/components/delete-category-dialog"
import { useAdminCategories } from "@/features/categories/api/queries"

const options = getOptions({
    filter: [
        {
            label: "Status",
            value: "status",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ],
    sort: [
        { label: "Name", value: "name" },
        { label: "Status", value: "status" },
        { label: "Date", value: "createdAt", type: "date" },
    ],
})

export default function AdminCategoriesPage() {
    const { query, controls } = useFilters({
        ...options,
        defaultSort: "createdAt:desc",
    })

    const { data: categories = [], isPlaceholderData } =
        useAdminCategories(query)

    const [editCategory, setEditCategory] = useState<AdminCategory | null>(null)
    const [deleteCategory, setDeleteCategory] = useState<AdminCategory | null>(
        null,
    )
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Update and Delete Dialogs */}
            <EditCategoryDialog
                category={editCategory}
                open={!!editCategory}
                onOpenChange={(open) => !open && setEditCategory(null)}
            />
            <DeleteCategoryDialog
                category={deleteCategory}
                open={!!deleteCategory}
                onOpenChange={(open) => !open && setDeleteCategory(null)}
            />
            {/* Page content */}
            <AdminPageHeader
                title="Categories"
                description={`Organize your products with categories (${categories.length} categories)`}
            >
                <CreateCategoryDialog
                    open={isCreateOpen}
                    onOpenChange={setIsCreateOpen}
                />
            </AdminPageHeader>
            <Filters
                {...controls}
                searchPlaceholder="Search by category name"
            />
            <CategoriesTable
                categories={categories}
                onUpdate={setEditCategory}
                onDelete={setDeleteCategory}
                isUpdating={isPlaceholderData}
            />
        </div>
    )
}
