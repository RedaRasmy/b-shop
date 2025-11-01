import type { RequiredButUndefined } from "@/types/global-types"
import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

type Primitive = string | number | boolean | undefined
type QueryParams = Record<string, Primitive>

export function useQueryParams<T extends QueryParams>(
    defaults: RequiredButUndefined<T>
) {
    const [searchParams, setSearchParams] = useSearchParams()

    const query = useMemo(() => {
        const result: QueryParams = { ...defaults }

        for (const key in defaults) {
            const value = searchParams.get(key)
            if (value !== null) {
                const def = result[key]
                if (typeof def === "number") {
                    const parsed = Number(value)
                    if (!isNaN(parsed)) result[key] = parsed
                } else if (typeof def === "boolean") {
                    if (value === "true" || value === "false") {
                        result[key] = value === "true"
                    }
                } else {
                    result[key] = value
                }
            }
        }

        return result as T
    }, [searchParams, defaults])

    const setQuery = useCallback(
        (updates: Partial<T>) => {
            const next = new URLSearchParams(searchParams)
            for (const [key, val] of Object.entries(updates)) {
                if (val === undefined || val === "") {
                    next.delete(key)
                } else {
                    next.set(key, String(val))
                }
            }
            setSearchParams(next)
        },
        [searchParams, setSearchParams]
    )

    return [query, setQuery] as [T, typeof setQuery]
}

/// test

// import type { ProductsQuery } from "@/features/products/query-keys"
// import { useDebounce } from "@/hooks/use-debounce"

// function Compo() {
//     const [query, setQuery] = useQueryParams<ProductsQuery>({
//         search: "",
//         categoryId: undefined,
//         page: 1,
//         perPage: 4,
//         sort: "",
//     })

//     const debouncedQuery = useDebounce({
//         state: query,
//     })
// }
