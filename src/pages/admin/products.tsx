import { getCategories, getProducts } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useTableControls } from "@/features/admin/hooks/use-table-controls"
import AddProductDialog from "@/features/admin/products/components/add-product-dialog"
import ProductsPagination from "@/features/admin/products/components/products-pagination"
import ProductsTable from "@/features/admin/products/components/products-table"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { useQuery } from "@tanstack/react-query"
import { useRef, useState } from "react"

type ProductsData = {
    data: AdminProduct[]
    page: number
    perPage: number
    total: number | null
    totalPages: number | null
}

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

    /// pagination
    const [page, setPage] = useState(1)
    const totalPagesRef = useRef<number>(1)

    
    // get categories
    const { data: categories = [] } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: () => getCategories(),
        select: (res) => {
            return res.data as AdminCategory[]
        },
    })

    // update query params to use categoryId instead of categoryName
    const { category, ...params } = queryParams
    const finalQueryParams = {
        ...params,
        categoryId: categories.find((c) => c.name === category)?.id,
        page,
        perPage: 15,
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

    const { data: { data: products = [] } = {} } = useQuery({
        queryKey: ["admin-products", finalQueryParams],
        queryFn: () => getProducts(finalQueryParams),
        select: (res) => {
            // setTotalPages(res.data.totalPages)
            const totalPages = res.data.totalPages
            if (totalPages) {
                totalPagesRef.current = res.data.totalPages
            }
            return res.data as ProductsData
        },
    })

    console.log("total pages : ", totalPagesRef.current)

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
            <ProductsPagination
                page={page}
                setPage={setPage}
                totalPages={totalPagesRef.current}
            />
        </div>
    )
}
