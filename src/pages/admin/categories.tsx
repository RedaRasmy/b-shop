import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/features/admin/components/categories/category-form"
import CategoryList from "@/features/admin/components/categories/category-list"
import { useCategoriesManager } from "@/features/admin/hooks/use-categories-manager"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import AdminPageHeader from "@/features/admin/components/page-header"
import { Plus } from "lucide-react"
import useFilters from "@/features/admin/hooks/use-filters"
import Filters from "@/features/admin/components/filter-controls"
import { getOptions } from "@/features/admin/components/filter-controls/get-options"

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

    const {
        categories,
        category,
        addForm,
        updateForm,
        confirm,
        triggers,
        isPlaceholderData,
    } = useCategoriesManager({ queryParams: query })

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
            <Filters
                {...controls}
                searchPlaceholder="Search by category name"
            />
            <CategoryList
                categories={categories}
                {...triggers}
                isUpdating={isPlaceholderData}
            />
        </div>
    )
}
