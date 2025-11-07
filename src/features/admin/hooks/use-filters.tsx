import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"
import { useDebounce } from "@/hooks/use-debounce"
import type { Prettify, SortOrder } from "@/types/global-types"
import { useCallback, useMemo } from "react"
import { parseAsString, useQueryStates } from "nuqs"

type FilterQuery<F extends FilterOptions | undefined> = F extends FilterOptions
    ? { [K in F[number]["value"]]?: string | null }
    : Record<never, never>

type QueryParams<F extends FilterOptions | undefined> = {
    search?: string
    sort: string // "field:order" format
} & FilterQuery<F>

type InternalQuery<F extends FilterOptions | undefined> = {
    search?: string
    sort: {
        field: string
        order: SortOrder
    }
    filters?: FilterQuery<F>
}

type UseSearchReturn<
    F extends FilterOptions | undefined,
    S extends SortOptions
> = {
    query: Prettify<QueryParams<F>>
    controls: {
        query: InternalQuery<F>
        setQuery: (update: Partial<InternalQuery<F>>) => void
        options: {
            filter?: F
            sort: S
        }
    }
}

export default function useFilters<
    F extends FilterOptions | undefined,
    S extends SortOptions
>({
    filterOptions,
    sortOptions,
    defaultSort,
}: {
    filterOptions?: F
    sortOptions: S
    defaultSort: `${S[number]["value"]}:${SortOrder}`
}): UseSearchReturn<F, S> {
    // search , sort , ...filters

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

    const finalQuery = useMemo(() => {
        const result = {
            ...debouncedQuery,
            search: debouncedQuery.search || undefined, // "" -> undefined
        }

        return result as QueryParams<F>
    }, [debouncedQuery])

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
//     } = useFilters({
//         filterOptions,
//         sortOptions,
//         defaultSort: "status:asc",
//     })

// }
