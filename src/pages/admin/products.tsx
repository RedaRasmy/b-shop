import { getCategories, getProducts } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useTableControls } from "@/features/admin/hooks/use-table-controls"
import AddProductDialog from "@/features/admin/products/components/add-product-dialog"
import ProductsTable from "@/features/admin/products/components/products-table"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { useQuery } from "@tanstack/react-query"

export default function AdminProductsPage() {
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

    const { data: categories = [] } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: () => getCategories(),
        select: (res) => {
            return res.data as AdminCategory[]
        },
    })

    // update query params to use categoryId instead of categoryName
    const { category, ...params } = queryParams
    const updatedQueryParams = {
        ...params,
        categoryId: categories.find((c) => c.name === category)?.id,
    }

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
        {
            label: "Category",
            value: "category",
            type: "select" as const,
            options: categories.map((c) => ({
                label: c.name,
                value: c.name,
            })),
        },
    ]

    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Status", value: "status" },
        { label: "Price", value: "price" },
        { label: "Stock", value: "stock" },
        { label: "Created Date", value: "createdAt" },
        { label: "Updated Date", value: "updatedAt" },
    ]

    const { data: products = [] } = useQuery({
        queryKey: ["admin-products", updatedQueryParams],
        queryFn: () => getProducts(updatedQueryParams),
        select: (res) => {
            return res.data.data as AdminProduct[]
        },
    })

    console.log("products : ", products)

    const tableProducts = products.map((product) => ({
        ...product,
        categoryName: categories.find((cat) => cat.id === product.categoryId)!
            .name,
    }))

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Poducts"
                description="Manage your product inventory"
            >
                <AddProductDialog />
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
            <ProductsTable products={tableProducts} />
        </div>
    )
}
