// import { useSearchParams } from "react-router-dom"
// import type { SortOrder } from "@/types/global-types"
// import { useCallback, useEffect, useMemo, useState } from "react"
// import type {
//     FilterOptions,
//     SortOptions,
// } from "@/features/admin/components/filter-controls"
// import { usePagination } from "@/features/admin/hooks/use-pagination"
// import { useDebounce } from "@/hooks/use-debounce"

// interface Params {
//     defaultSort?: string
//     filterOptions: FilterOptions
//     sortOptions: SortOptions
//     pagination?: boolean
//     perPage?: number
// }

// // this hook use url query params : search , sort , ...
// // provide values and setters of those params + queryParams object ready to use in requests

// export function useFilterControls(options: Params) {
//     const {
//         defaultSort = "createdAt:desc",
//         filterOptions,
//         sortOptions,
//         pagination = false,
//         perPage,
//     } = options

//     /// Pagination
//     const { page, setPage, resetPage } = usePagination()

//     const [searchParams, setSearchParams] = useSearchParams()

//     // Get current values from URL
//     const urlSearchTerm = searchParams.get("search") || ""
//     const sort = searchParams.get("sort") || defaultSort

//     const [sortBy, sortOrder] = sort.split(":") as [string, SortOrder]

//     // Debounce search term for API calls only
//     const [searchTerm, setSearchTermState] = useState(urlSearchTerm)

//     // Sync local state when URL changes externally (back/forward)
//     useEffect(() => {
//         setSearchTermState(urlSearchTerm)
//     }, [urlSearchTerm])

//     // Helper to update URL params
//     const updateParams = useCallback(
//         (updates: Record<string, string | undefined>) => {
//             setSearchParams((prev) => {
//                 const params = new URLSearchParams(prev)

//                 Object.entries(updates).forEach(([key, value]) => {
//                     if (value === undefined || value === "") {
//                         params.delete(key)
//                     } else {
//                         params.set(key, value)
//                     }
//                 })
//                 return params
//             })
//         },
//         [setSearchParams]
//     )

//     const handleDebouncedSearch = useCallback(
//         (debouncedValue: string) => {
//             if (urlSearchTerm !== debouncedValue) {
//                 updateParams({ search: debouncedValue })
//                 resetPage()
//             }
//         },
//         [urlSearchTerm, updateParams, resetPage]
//     )

//     const debouncedSearchTerm = useDebounce({
//         state: searchTerm,
//         delay: 300,
//         onDebounced: handleDebouncedSearch,
//     })

//     // Get all filter params (anything that's not search or sort)
//     const filters = useMemo(() => {
//         const result: Record<string, string> = {}
//         searchParams.forEach((value, key) => {
//             if (!["search", "sort"].includes(key)) {
//                 result[key] = value
//             }
//         })
//         return result
//     }, [searchParams])

//     const setSearchTerm = useCallback((search: string) => {
//         // Only update local state - URL updates via useEffect with debounce
//         setSearchTermState(search)
//     }, [])

//     const setFilter = useCallback(
//         (key: string, value: string) => {
//             updateParams({ [key]: value })
//             resetPage()
//         },
//         [updateParams, resetPage]
//     )

//     const setFilters = useCallback(
//         (newFilters: Record<string, string>) => {
//             updateParams(newFilters)
//             resetPage()
//         },
//         [updateParams, resetPage]
//     )

//     const clearFilters = useCallback(() => {
//         setSearchParams((prev) => {
//             const params = new URLSearchParams()

//             // Keep search and sort params, remove all filters
//             const search = prev.get("search")
//             const sort = prev.get("sort")

//             if (search) params.set("search", search)
//             if (sort) params.set("sort", sort)

//             return params
//         })
//         setPage(1)
//     }, [setSearchParams, setPage])

//     const setSort = useCallback(
//         (field: string, order: SortOrder) => {
//             const sort = `${field}:${order}`
//             updateParams({ sort })
//             resetPage()
//         },
//         [updateParams, resetPage]
//     )

//     // Build query params object for API calls

//     const queryParams = useMemo(() => {
//         const params: Record<string, string | undefined> = {
//             search: debouncedSearchTerm || undefined,
//             sort,
//         }

//         // Add all filters
//         Object.entries(filters).forEach(([key, value]) => {
//             params[key] = value || undefined
//         })

//         if (pagination) {
//             return {
//                 ...params,
//                 page,
//                 perPage,
//             } as Record<string, number | string | undefined>
//         }

//         return params
//     }, [debouncedSearchTerm, sort, filters, page, pagination, perPage])

//     return {
//         // Current values
//         searchTerm,
//         filters,
//         sort,
//         sortBy,
//         sortOrder,
//         queryParams,
//         // Setters
//         setSearchTerm,
//         setFilter,
//         setFilters,
//         clearFilters,
//         setSort,
//         controls: {
//             activeFilters: filters,
//             onClearFilters: clearFilters,
//             sortBy,
//             filterOptions,
//             searchTerm,
//             sortOptions,
//             sortOrder,
//             onFilterChange: setFilter,
//             onSearchChange: setSearchTerm,
//             onSortChange: setSort,
//         },
//         page,
//         setPage,
//     }
// }
