import type { ProductSummary } from "@/features/products/types"
import type { Prettify } from "@/types/global-types"

export type CartProduct = Prettify<ProductSummary & { quantity: number }>
