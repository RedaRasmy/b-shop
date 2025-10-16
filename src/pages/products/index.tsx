import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { getCategories } from "@/features/categories/categories-requests"
import type { Category } from "@/features/categories/categories.validation"
import FilterBar from "@/features/products/components/filter-bar"
import { ProductCard } from "@/features/products/components/product-card"
import SearchBar from "@/features/products/components/search-bar"
import ShopHeader from "@/features/products/components/shop-header"
import { getProducts } from "@/features/products/product-requests"
import type { ProductSummary } from "@/features/products/products.validation"
import { queryKeys, type ProductsQuery } from "@/lib/query-keys"
import type { PaginationResponse } from "@/lib/types"
import LoadingPage from "@/pages/loading"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Fragment, useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"

export default function ProductsPage() {
    const { ref, inView } = useInView()
    const totalPagesRef = useRef(1)
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
        search: search || undefined,
    }

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: [queryKeys.products.customer(queryParams)],
            queryFn: async ({ pageParam }) => {
                const res = await getProducts({
                    ...queryParams,
                    page: pageParam,
                })
                if (res.data.totalPages) {
                    totalPagesRef.current = res.data.totalPages
                }
                return res.data as PaginationResponse<ProductSummary[]>
            },
            initialPageParam: 1,
            getPreviousPageParam: (data) => data.page - 1,
            getNextPageParam: (data) =>
                totalPagesRef.current <= data.page ? undefined : data.page + 1,
        })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            console.log("effect runs")
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
    const { addItem } = useCart(isAuthenticated)

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
                                {data.map((product: ProductSummary) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={() => addItem(product.id)}
                                        isFavorite
                                        onFavoriteChange={() => {}}
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
