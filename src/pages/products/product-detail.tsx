import ProductPath from "@/features/products/components/product-path"
import ProductSection from "@/features/products/components/product-section"
import { getProduct } from "@/features/products/product-requests"
import type { Product } from "@/features/products/products.validation"
import { queryKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>()

    if (!slug) throw new Error("Impossible")

    const { data: product } = useQuery({
        queryKey: queryKeys.products.detail(slug),
        queryFn: () => getProduct(slug),
        select: (res) => {
            console.log("detailed product response : ", res)
            return res.data as Product
        },
    })

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
                {/* <div className="h-500"></div> */}
            </div>
        )
}
