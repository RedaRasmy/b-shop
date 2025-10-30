import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { ProductCard } from "@/features/products/components/product-card"
import ProductPath from "@/features/products/components/product-path"
import ProductSection from "@/features/products/components/product-section"
import { productKeys } from "@/features/products/query-keys"
import { fetchProduct, fetchProducts } from "@/features/products/requests"
import LoadingPage from "@/pages/loading"
import NotFoundPage from "@/pages/not-found"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>()

    if (!slug)
        throw new Error(
            "ProductDetailPage should be in a dynamic route with :slug"
        )

    const {
        data: product,
        isError,
        isLoading,
    } = useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => fetchProduct(slug),
    })

    const { data: sameCategoryProducts } = useQuery({
        queryKey: productKeys.related(product?.categoryId),
        queryFn: () =>
            fetchProducts({
                categoryId: product?.categoryId,
            }),
        enabled: !!product,
        select: (data) => {
            return data.data
        },
    })

    const relatedProducts = useMemo(() => {
        return sameCategoryProducts?.filter((p) => p.id !== product?.id) || []
    }, [sameCategoryProducts, product?.id])

    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
    const { addItem } = useCart(isAuthenticated)

    if (isAuthLoading || isLoading) return <LoadingPage />

    if (isError || !product) return <NotFoundPage />

    if (product)
        return (
            <div className="flex flex-col px-3 md:px-4 lg:px-8 xl:px-20 2xl:px-35 3xl:px-60 3xl  py-2 md:py-3 lg:py-6 xl:py-8  ">
                <ProductPath
                    category={product.categoryName}
                    name={product.name}
                />
                <ProductSection
                    product={product}
                    onAddToCart={(quantity) => addItem(product.id, quantity)}
                />
                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={() => addItem(product.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
}
