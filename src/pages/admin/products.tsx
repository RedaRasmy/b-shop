import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import AdminPageHeader from "@/features/admin/components/page-header"
import ProductForm from "@/features/admin/products/components/product-form"
import ProductsPagination from "@/features/admin/components/pagination"
import ProductsTable from "@/features/admin/products/components/products-table"
import useProductsManager from "@/features/admin/products/use-products-manager"
import { Plus } from "lucide-react"
import { useMemo } from "react"
import { useAdminCategories } from "@/features/categories/api/queries"
import usePaginatedFilters from "@/features/admin/hooks/use-paginated-filters"
import FilterControls2 from "@/features/admin/components/filter-controls/filter-controls2"

const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
    { label: "Price", value: "price" },
    { label: "Stock", value: "stock" },
    { label: "Created Date", value: "createdAt" },
    { label: "Updated Date", value: "updatedAt" },
] as const

export default function AdminProductsPage() {
    // get categories
    const { data: categories = [] } = useAdminCategories()

    const filterOptions = useMemo(
        () =>
            [
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
            ] as const,
        [categories]
    )

    // Filter controls
    const { query, controls, page, setPage } = usePaginatedFilters({
        filterOptions,
        sortOptions,
        defaultSort: "createdAt:desc",
    })

    const {
        addForm,
        updateForm,
        confirm,
        products,
        id,
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
            <ProductForm key={"update-form-dialog" + id} {...updateForm} />
            <DeleteConfirmDialog
                key={"delete-confirm-dialog" + id}
                {...confirm}
            />
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
            <FilterControls2 {...controls} />
            <ProductsTable
                products={products}
                {...triggers}
                isUpdating={isPlaceholderData}
            />
            <ProductsPagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    )
}
