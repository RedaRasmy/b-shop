import { Button } from "@/components/ui/button"
import {
    addProduct,
    getCategories,
    getProducts,
} from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import FilterControls from "@/features/admin/components/filter-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useFilterControls } from "@/features/admin/hooks/use-filter-controls"
import ProductForm from "@/features/admin/products/components/product-form"
import ProductsPagination from "@/features/admin/products/components/products-pagination"
import ProductsTable from "@/features/admin/products/components/products-table"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/main"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useRef, useState } from "react"

const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
    { label: "Price", value: "price" },
    { label: "Stock", value: "stock" },
    { label: "Created Date", value: "createdAt" },
    { label: "Updated Date", value: "updatedAt" },
]

type ProductsData = {
    data: AdminProduct[]
    page: number
    perPage: number
    total: number | null
    totalPages: number | null
}

export default function AdminProductsPage() {
    const [isAddOpen, setIsAddOpen] = useState(false)

    // get categories
    const { data: categories = [] } = useQuery({
        queryKey: queryKeys.categories.admin(),
        queryFn: () => getCategories(),
        select: (res) => {
            return res.data as AdminCategory[]
        },
    })

    const filterOptions = [
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
        },
    ]

    const { queryParams, controls } = useFilterControls({
        filterOptions,
        sortOptions,
    })

    /// pagination
    const [page, setPage] = useState(1)
    const totalPagesRef = useRef<number>(1)

    // update query params to use categoryId instead of categoryName
    const { category, ...params } = queryParams
    const finalQueryParams = {
        ...params,
        categoryId: categories.find((c) => c.name === category)?.id,
        page,
        perPage: 15,
    }

    const { data: { data: products = [] } = {} } = useQuery({
        queryKey: queryKeys.products.admin(finalQueryParams),
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

    const tableProducts = products.map((product) => ({
        ...product,
        categoryName: categories.find((cat) => cat.id === product.categoryId)!
            .name,
    }))

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: FormData) => addProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            })
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            setIsAddOpen(false)
        },
    })

    async function onSubmit(data: FormData) {
        await mutateAsync(data)
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Poducts"
                description="Manage your product inventory"
            >
                <ProductForm
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    categories={categories}
                    title="Add Product"
                    description="Add a new product to your inventory."
                    buttonText="Add Product"
                    onSubmit={onSubmit}
                    isSubmitting={isPending}
                >
                    <Button>
                        <Plus />
                        Add Product
                    </Button>
                </ProductForm>
            </AdminPageHeader>
            <FilterControls {...controls} />
            <ProductsTable products={tableProducts} />
            <ProductsPagination
                page={page}
                setPage={setPage}
                totalPages={totalPagesRef.current}
            />
        </div>
    )
}
