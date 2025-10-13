import { getCategories } from "@/features/categories/categories-requests"
import type { Category } from "@/features/categories/categories.validation"
import FilterBar from "@/features/products/components/filter-bar"
import { ProductCard } from "@/features/products/components/product-card"
import SearchBar from "@/features/products/components/search-bar"
import ShopHeader from "@/features/products/components/shop-header"
import { getProducts } from "@/features/products/product-requests"
import type { ProductSummary } from "@/features/products/products.validation"
import { queryKeys, type ProductsQuery } from "@/lib/query-keys"
import LoadingPage from "@/pages/loading"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export default function ProductsPage() {
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("createdAt:desc")

    const { data: categories = [], isLoading } = useQuery({
        queryKey: queryKeys.categories.customer(),
        queryFn: getCategories,
        select: (res) => res.data as Category[],
    })

    const queryParams: ProductsQuery = {
        categoryId: categoryId || undefined,
        sort: sortBy,
        search : search || undefined
        // perPage: 2,
    }

    const { data: products } = useQuery({
        queryKey: queryKeys.products.customer(queryParams),
        queryFn: () => getProducts(queryParams),
        select: (res) => res.data.data as ProductSummary[],
    })

    console.log(products)

    if (isLoading) return <LoadingPage />

    return (
        <div>
            <ShopHeader />
            <div className="mx-auto px-4 lg:px-10 xl:px-20 py-8 ">
                <SearchBar value={search} onChange={(val) => setSearch(val)} />
                <FilterBar
                    categories={categories}
                    categoryId={categoryId}
                    onCategoryChange={(id) => setCategoryId(id)}
                    onSortChange={(sort) => setSortBy(sort)}
                    sortBy={sortBy}
                />
                {products && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isFavorite
                                onAddToCart={() => {}}
                                onFavoriteChange={() => {}}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
