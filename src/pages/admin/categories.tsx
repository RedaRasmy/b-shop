import { AddCategoryDialog } from "@/features/admin/categories/components/add-category-dialog";
import AdminPageHeader from "@/features/admin/components/page-header";

export default function AdminCategoriesPage() {
    return (
        <div>
            <AdminPageHeader
                title="Categories"
                description="Organize your products with categories (5 categories)"
            >
                <AddCategoryDialog />
            </AdminPageHeader>
        </div>
    )
}
