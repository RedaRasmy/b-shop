import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"
import { useDebounce } from "@/hooks/use-debounce"
import type { Prettify, SortOrder } from "@/types/global-types"
import { parseAsString, useQueryStates } from "nuqs"
import { useCallback, useMemo, useState } from "react"

// Helper Types

type FilterQuery<F extends FilterOptions | undefined> = F extends FilterOptions
    ? { [K in F[number]["value"]]?: string | null }
    : Record<never, never>

type PaginatedQuery<
    F extends FilterOptions | undefined,
    P extends number | undefined
> = Prettify<
    {
        search?: string
        sort: string
        page: number
        perPage: P extends number ? number : undefined
    } & FilterQuery<F>
>

type InternalQuery<F extends FilterOptions | undefined> = {
    search?: string
    sort: {
        field: string
        order: SortOrder
    }
    filters?: FilterQuery<F>
}

type Return<
    F extends FilterOptions | undefined,
    S extends SortOptions,
    P extends number | undefined
> = {
    query: PaginatedQuery<F, P>
    controls: {
        query: InternalQuery<F>
        setQuery: (query: Partial<InternalQuery<F>>) => void
        options: {
            filter?: Readonly<F>
            sort: S
        }
    }
    page: number
    setPage: (page: number) => void
}

export default function usePaginatedFilters<
    F extends FilterOptions | undefined,
    S extends SortOptions,
    P extends number | undefined
>({
    pageSize,
    filterOptions,
    sortOptions,
    defaultSort,
}: {
    pageSize?: P
    filterOptions?: F
    sortOptions: S
    defaultSort: `${S[number]["value"]}:${SortOrder}`
}): Return<F, S, P> {
    // search , sort , ...filters

    console.log("runs")

    const filters = filterOptions ? filterOptions.map((f) => f.value) : []

    const filterParsers = filters.reduce((acc, key) => {
        acc[key] = parseAsString
        return acc
    }, {} as Record<string, unknown>)

    const [query, setQuery] = useQueryStates(
        {
            search: parseAsString,
            sort: parseAsString.withDefault(defaultSort),
            ...filterParsers,
        },
        {
            limitUrlUpdates: {
                method: "throttle",
                timeMs: 300,
            },
        }
    )

    const debouncedQuery = useDebounce({
        state: query,
    })

    /// Build Internal Query

    const internalQuery = useMemo(() => {
        const { search, sort, ...filters } = query
        const [field, order] = sort.split(":") as [string, SortOrder]
        return {
            search: search ?? "",
            sort: { field, order },
            filters: filters as FilterQuery<F>,
        } as InternalQuery<F>
    }, [query])

    const handleSetQuery = useCallback(
        ({ search, sort, filters }: Partial<InternalQuery<F>>) => {
            setQuery({
                ...(search !== undefined && { search: search || null }),
                ...(sort && { sort: `${sort.field}:${sort.order}` }),
                ...filters,
            })
        },
        [setQuery]
    )

    ///

    const [page, setPage] = useState(1)

    const finalQuery = useMemo(() => {
        const result = {
            ...debouncedQuery,
            search: debouncedQuery.search || undefined, // "" -> undefined
            page,
            perPage: pageSize,
        } as PaginatedQuery<F, P>

        return result
    }, [debouncedQuery, pageSize, page])

    return {
        query: finalQuery,
        controls: {
            query: internalQuery,
            setQuery: handleSetQuery,
            options: {
                filter: filterOptions,
                sort: sortOptions,
            },
        },
        page,
        setPage,
    }
}

// // TEST

// const filterOptions = [
//     {
//         label: "Status",
//         value: "status",
//         options: [
//             { label: "Active", value: "active" },
//             { label: "Inactive", value: "inactive" },
//         ],
//     },
//     {
//         label: "Category",
//         value: "category",
//         options: [
//             { label: "Tech", value: "tech" },
//             { label: "Fashion", value: "fashion" },
//         ],
//         nullable: true,
//     },
// ] as const

// const sortOptions = [
//     { label: "Name", value: "name" },
//     { label: "Status", value: "status" },
//     { label: "Price", value: "price" },
//     { label: "Stock", value: "stock" },
//     { label: "Created Date", value: "createdAt" },
//     { label: "Updated Date", value: "updatedAt" },
// ] as const

// function Compo() {
//     const {
//         query: q,
//         controls: { query, options, setQuery },
//         page,
//         setPage,
//     } = usePaginatedFilters({
//         filterOptions,
//         sortOptions,
//         pageSize: 5,
//         defaultSort: "createdAt:asc",
//     })
// }
