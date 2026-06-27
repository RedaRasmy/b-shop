import AdminPageHeader from "@/features/admin/components/page-header"
import ProductsPagination from "@/features/admin/components/pagination"
import ProductsTable from "@/features/admin/components/tables/products-table"
import { useMemo, useState } from "react"
import { useAdminCategories } from "@/features/categories/api/queries"
import usePaginatedFilters from "@/features/admin/hooks/use-paginated-filters"
import Filters from "@/features/admin/components/filter-controls"
import { getOptions } from "@/features/admin/components/filter-controls/get-options"
import { CreateProductDialog } from "@/features/admin/components/create-product-dialog"
import { EditProductDialog } from "@/features/admin/components/edit-product-dialog"
import type { AdminProduct } from "@/features/products/types"
import { DeleteProductDialog } from "@/features/admin/components/delete-product-dialog"
import { useAdminProducts } from "@/features/products/api/queries"

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
                    {
                        label: "Featured",
                        value: "featured",
                        options: [
                            { label: "Featured", value: "true" },
                            { label: "Normal", value: "false" },
                        ],
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
        [categories],
    )

    // Filter controls
    const {
        query: { category, ...params },
        controls,
        page,
        setPage,
    } = usePaginatedFilters({
        ...options,
        defaultSort: "createdAt:desc",
        pageSize: 15,
    })

    const { data, isPlaceholderData } = useAdminProducts({
        ...params,
        categoryId:
            category === "__NULL__"
                ? "__NULL__" // for deleted categories
                : categories.find((c) => c.slug === category)?.id,
    })

    const products = data?.data || []

    const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
    const [deleteProduct, setDeleteProduct] = useState<AdminProduct | null>(
        null,
    )
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    return (
        <div className="space-y-6 h-full flex flex-col">
            <EditProductDialog
                product={editProduct}
                open={!!editProduct}
                onOpenChange={(open) => !open && setEditProduct(null)}
            />
            <DeleteProductDialog
                product={deleteProduct}
                open={!!deleteProduct}
                onOpenChange={(open) => !open && setDeleteProduct(null)}
            />
            <AdminPageHeader
                title="Products"
                description={`Manage your product inventory (${data?.total ?? 0} products) `}
            >
                <CreateProductDialog
                    open={isCreateOpen}
                    onOpenChange={setIsCreateOpen}
                />
            </AdminPageHeader>
            <Filters {...controls} searchPlaceholder="Search by product name" />
            <ProductsTable
                products={products}
                onUpdate={setEditProduct}
                onDelete={setDeleteProduct}
                isUpdating={isPlaceholderData}
            />
            <ProductsPagination
                page={page}
                setPage={setPage}
                totalPages={data?.totalPages ?? 1}
            />
        </div>
    )
}
