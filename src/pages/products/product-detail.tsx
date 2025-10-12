import ProductPath from "@/features/products/components/product-path"
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
            <div className="px-4 lg:px-6 py-5">
                <ProductPath
                    category={product.categoryName}
                    name={product.name}
                />
            </div>
        )
}
