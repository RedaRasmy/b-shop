import { adminCategoriesHandlers } from "@/features/admin/components/categories/tests/handlers"
import { authHandlers } from "@/features/auth/tests/handlers"
import { setupServer } from "msw/node"

export const server = setupServer(...authHandlers, ...adminCategoriesHandlers)
