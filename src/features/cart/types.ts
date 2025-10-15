import type { ProductSummary } from "@/features/products/products.validation"
import type { Prettify } from "@/lib/types"

export type CartProduct = Prettify<ProductSummary & { quantity: number }>