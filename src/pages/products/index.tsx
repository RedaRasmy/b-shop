import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/features/auth/use-auth"
import useCartManager from "@/features/cart/hooks/use-cart-manager"
import FilterBar from "@/features/products/components/filter-bar"
import { ProductCard } from "@/features/products/components/product-card"
import SearchBar from "@/features/products/components/search-bar"
import ShopHeader from "@/features/products/components/shop-header"
import { type ProductsQuery } from "@/features/products/query-keys"
import LoadingPage from "@/pages/loading"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useCategories } from "@/features/categories/api/queries"
import { useInfiniteProducts } from "@/features/products/api/queries"

export default function ProductsPage() {
    const { ref, inView } = useInView()
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("createdAt:desc")

    const { data: categories = [], isLoading } = useCategories()

    const queryParams: ProductsQuery = useMemo(
        () => ({
            categoryId: categoryId || undefined,
            sort: sortBy,
            search: search || undefined,
        }),
        [categoryId, search, sortBy]
    )

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteProducts(queryParams)

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
    const { addItem } = useCartManager(isAuthenticated)

    if (isAuthLoading || isLoading) return <LoadingPage />

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
                {data && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {data.pages.map(({ data }, index) => (
                            <Fragment key={index}>
                                {data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={() => addItem(product.id)}
                                    />
                                ))}
                            </Fragment>
                        ))}
                        {isFetchingNextPage && hasNextPage && (
                            <Spinner className="w-full mx-auto my-auto size-8" />
                        )}
                        <div ref={ref} />
                    </div>
                )}
            </div>
        </div>
    )
}
