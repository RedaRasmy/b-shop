import type { ProductSummary } from "@/features/products/validation"
import type { Prettify } from "@/types/global-types"

export type CartProduct = Prettify<ProductSummary & { quantity: number }>
