import { ProductCard } from "@/features/products/components/product-card"
import ProductPath from "@/features/products/components/product-path"
import ProductSection from "@/features/products/components/product-section"
import { getProduct, getProducts } from "@/features/products/product-requests"
import type {
    Product,
    ProductSummary,
} from "@/features/products/products.validation"
import { queryKeys } from "@/lib/query-keys"
import LoadingPage from "@/pages/loading"
import NotFoundPage from "@/pages/not-found"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>()

    if (!slug) throw new Error("Impossible")

    const {
        data: product,
        isError,
        isLoading,
    } = useQuery({
        queryKey: queryKeys.products.detail(slug),
        queryFn: () => getProduct(slug),
        select: (res) => {
            console.log("detailed product response : ", res)
            return res.data as Product
        },
        retry: false,
    })

    const { data: relatedProducts = [] } = useQuery({
        queryKey: queryKeys.products.related(slug),
        queryFn: () =>
            getProducts({
                categoryId: product?.categoryId,
            }),
        enabled: !!product,
        select: (res) => {
            console.log("related products response : ", res)
            return res.data.data.filter(
                (p: ProductSummary) => p.id !== product?.id
            ) as ProductSummary[]
        },
    })

    if (isLoading) return <LoadingPage />

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
                    isFavorite={false}
                    onFavoriteChange={() => {}}
                    onAddToCart={() => {}}
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
                                    isFavorite={false}
                                    onAddToCart={() => {}}
                                    onFavoriteChange={() => {}}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
}
