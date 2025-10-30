import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import CategoryList from "@/features/admin/categories/components/category-list"
import { useCategoriesManager } from "@/features/admin/categories/hooks/use-admin-categories"
import FilterControls from "@/features/admin/components/filter-controls"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useFilterControls } from "@/features/admin/hooks/use-filter-controls"
import { Plus } from "lucide-react"

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

export default function AdminCategoriesPage() {
    const { queryParams, controls } = useFilterControls({
        filterOptions,
        sortOptions,
    })

    const { categories, category, addForm, updateForm, confirm, triggers } =
        useCategoriesManager({ queryParams })

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
            <FilterControls {...controls} />
            <CategoryList categories={categories} {...triggers} />
        </div>
    )
}
