import { useSearchParams } from "react-router-dom"
import type { Order } from "@/lib/types"
import { useCallback, useMemo } from "react"
import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"

interface Params {
    defaultSort?: string
    filterOptions: FilterOptions
    sortOptions: SortOptions
}

export function useFilterControls(options: Params) {
    const {
        defaultSort = "createdAt:desc",
        filterOptions,
        sortOptions,
    } = options

    const [searchParams, setSearchParams] = useSearchParams()

    // Get current values from URL
    const searchTerm = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || defaultSort

    const [sortBy, sortOrder] = sort.split(":") as [string, Order]

    // Get all filter params (anything that's not search or sort)
    const filters = useMemo(() => {
        const result: Record<string, string> = {}
        searchParams.forEach((value, key) => {
            if (!["search", "sort"].includes(key)) {
                result[key] = value
            }
        })
        return result
    }, [searchParams])

    // Helper to update URL params
    const updateParams = useCallback(
        (updates: Record<string, string | undefined>) => {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev)

                Object.entries(updates).forEach(([key, value]) => {
                    if (value === undefined || value === "") {
                        params.delete(key)
                    } else {
                        params.set(key, value)
                    }
                })

                return params
            })
        },
        [setSearchParams]
    )

    const setSearchTerm = useCallback(
        (search: string) => {
            updateParams({ search })
        },
        [updateParams]
    )

    const setFilter = useCallback(
        (key: string, value: string) => {
            updateParams({ [key]: value })
        },
        [updateParams]
    )

    const setFilters = useCallback(
        (newFilters: Record<string, string>) => {
            updateParams(newFilters)
        },
        [updateParams]
    )

    const clearFilters = useCallback(() => {
        setSearchParams((prev) => {
            const params = new URLSearchParams()

            // Keep search and sort params, remove all filters
            const search = prev.get("search")
            const sort = prev.get("sort")

            if (search) params.set("search", search)
            if (sort) params.set("sort", sort)

            return params
        })
    }, [setSearchParams])

    const setSort = useCallback(
        (field: string, order: Order) => {
            const sort = `${field}:${order}`
            updateParams({ sort })
        },
        [updateParams]
    )

    // Build query params object for API calls
    const queryParams = useMemo(() => {
        const params: Record<string, string | undefined> = {
            search: searchTerm || undefined,
            sort,
        }

        // Add all filters
        Object.entries(filters).forEach(([key, value]) => {
            params[key] = value || undefined
        })

        return params
    }, [searchTerm, sort, filters])

    return {
        // Current values
        searchTerm,
        filters,
        sort,
        sortBy,
        sortOrder,
        queryParams,

        // Setters
        setSearchTerm,
        setFilter,
        setFilters,
        clearFilters,
        setSort,
        controls: {
            activeFilters: filters,
            onClearFilters: clearFilters,
            sortBy,
            filterOptions,
            searchTerm,
            sortOptions,
            sortOrder,
            onFilterChange: setFilter,
            onSearchChange: setSearchTerm,
            onSortChange: setSort,
        },
    }
}
