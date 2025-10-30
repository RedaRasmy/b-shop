import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { categoryKeys } from "@/features/categories/query-keys"
import { fetchCategories } from "@/features/categories/requests"
import type { Category } from "@/features/categories/types"
import FilterBar from "@/features/products/components/filter-bar"
import { ProductCard } from "@/features/products/components/product-card"
import SearchBar from "@/features/products/components/search-bar"
import ShopHeader from "@/features/products/components/shop-header"
import { productKeys, type ProductsQuery } from "@/features/products/query-keys"
import { fetchProducts } from "@/features/products/api/requests"
import LoadingPage from "@/pages/loading"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { useInView } from "react-intersection-observer"

export default function ProductsPage() {
    const { ref, inView } = useInView()
    const totalPagesRef = useRef(1)
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("createdAt:desc")

    const { data: categories = [], isLoading } = useQuery({
        queryKey: categoryKeys.customer(),
        queryFn: fetchCategories,
        select: (res) => res.data as Category[],
    })

    const queryParams: ProductsQuery = useMemo(
        () => ({
            categoryId: categoryId || undefined,
            sort: sortBy,
            search: search || undefined,
        }),
        [categoryId, search, sortBy]
    )

    const handleFetchProducts = useCallback(
        async ({ pageParam = 1 }) => {
            const data = await fetchProducts({
                categoryId: categoryId || undefined,
                sort: sortBy,
                search: search || undefined,
                page: pageParam,
            })
            if (data.totalPages) {
                totalPagesRef.current = data.totalPages
            }
            return data
        },
        [categoryId, sortBy, search]
    )

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: productKeys.infinite(queryParams),
            queryFn: handleFetchProducts,
            initialPageParam: 1,
            getPreviousPageParam: (data) => data.page - 1,
            getNextPageParam: (data) =>
                totalPagesRef.current <= data.page ? undefined : data.page + 1,
        })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
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
