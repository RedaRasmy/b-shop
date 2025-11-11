import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import AdminPageHeader from "@/features/admin/components/page-header"
import ProductForm from "@/features/admin/components/forms/product-form"
import ProductsPagination from "@/features/admin/components/pagination"
import ProductsTable from "@/features/admin/components/tables/products-table"
import useProductsManager from "@/features/admin/hooks/use-products-manager"
import { Plus } from "lucide-react"
import { useMemo } from "react"
import { useAdminCategories } from "@/features/categories/api/queries"
import usePaginatedFilters from "@/features/admin/hooks/use-paginated-filters"
import Filters from "@/features/admin/components/filter-controls"
import { getOptions } from "@/features/admin/components/filter-controls/get-options"

export default function AdminProductsPage() {
    const { data: categories = [] } = useAdminCategories()

    const options = useMemo(
        () =>
            getOptions({
                filter: [
                    {
                        label: "Status",
                        value: "status",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ],
                    },
                    {
                        label: "Category",
                        value: "category",
                        options: categories.map((c) => ({
                            label: c.name,
                            value: c.name,
                        })),
                        nullable: true,
                    },
                ],
                sort: [
                    { label: "Name", value: "name" },
                    { label: "Status", value: "status" },
                    { label: "Price", value: "price", type: "number" },
                    { label: "Stock", value: "stock", type: "number" },
                    { label: "Date", value: "createdAt", type: "date" },
                ],
            }),
        [categories]
    )

    // Filter controls
    const { query, controls, page, setPage } = usePaginatedFilters({
        ...options,
        defaultSort: "createdAt:desc",
        pageSize: 15,
    })

    const {
        addForm,
        updateForm,
        confirm,
        products,
        updatingId,
        deletingId,
        triggers,
        total,
        totalPages,
        isPlaceholderData,
    } = useProductsManager({
        queryParams: query,
        categories,
    })

    return (
        <div className="space-y-6 h-full flex flex-col">
            <ProductForm key={updatingId ?? undefined} {...updateForm} />
            <DeleteConfirmDialog key={deletingId ?? undefined} {...confirm} />
            <AdminPageHeader
                title="Products"
                description={`Manage your product inventory (${total} products) `}
            >
                <ProductForm {...addForm}>
                    <Button>
                        <Plus />
                        Add Product
                    </Button>
                </ProductForm>
            </AdminPageHeader>
            <Filters {...controls} searchPlaceholder="Search by product name" />
            <ProductsTable
                products={products}
                {...triggers}
                isUpdating={isPlaceholderData}
            />
            <ProductsPagination
                page={page}
                setPage={setPage}
                totalPages={totalPages ?? 1}
            />
        </div>
    )
}
