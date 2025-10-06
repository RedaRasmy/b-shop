import { Button } from "@/components/ui/button"
import { getCategories } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import FilterControls, { type FilterOptions } from "@/features/admin/components/filter-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useFilterControls } from "@/features/admin/hooks/use-filter-controls"
import ProductForm from "@/features/admin/products/components/product-form"
import ProductsPagination from "@/features/admin/products/components/products-pagination"
import ProductsTable from "@/features/admin/products/components/products-table"
import useAdminProducts from "@/features/admin/products/use-admin-products"
import { queryKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useMemo } from "react"

const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
    { label: "Price", value: "price" },
    { label: "Stock", value: "stock" },
    { label: "Created Date", value: "createdAt" },
    { label: "Updated Date", value: "updatedAt" },
]

export default function AdminProductsPage() {
    // get categories
    const { data: categories = [] } = useQuery({
        queryKey: queryKeys.categories.admin(),
        queryFn: () => getCategories(),
        select: (res) => {
            return res.data as AdminCategory[]
        },
    })

    const filterOptions = useMemo<FilterOptions>(
        () => [
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
                nullable : true
            },
        ] ,
        [categories]
    )

    // Filter controls
    const { queryParams, controls, page, setPage } = useFilterControls({
        filterOptions,
        sortOptions,
        pagination: true,
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
    } = useAdminProducts({
        queryParams,
        categories,
    })

    return (
        <div className="space-y-6 h-full flex flex-col">
            <ProductForm key={"update-form-dialog" + id} {...updateForm}  />
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
            <FilterControls {...controls} />
            <ProductsTable products={products} {...triggers} />
            <ProductsPagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
    )
}
