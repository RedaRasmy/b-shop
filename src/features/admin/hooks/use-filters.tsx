import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryParams } from "@/hooks/use-query-params"
import type { Prettify, SortOrder } from "@/types/global-types"
import { useCallback, useMemo } from "react"

type FilterQuery<F extends FilterOptions | undefined> = F extends FilterOptions
    ? { [K in F[number]["value"]]?: string }
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

    console.log("runs")

    const queryParamsConfig = useMemo(() => {
        const config: Record<string, { type: "string"; default?: string }> = {
            search: { type: "string" },
            sort: { type: "string", default: defaultSort },
        }
        filterOptions?.forEach((filter) => {
            config[filter.value] = { type: "string" }
        })

        return config
    }, [defaultSort, filterOptions])

    const [query, setQuery] = useQueryParams(queryParamsConfig)

    const debouncedQuery = useDebounce({
        state: query,
    })

    const { search, sort, ...filters } = query
    const sortString = sort || defaultSort
    const [field, order] = sortString.split(":") as [string, SortOrder]

    const internalQuery: InternalQuery<F> = {
        search: search,
        sort: { field, order },
        filters: filters as FilterQuery<F>,
    }

    ///

    const handleSetQuery = useCallback(
        ({ search, sort, filters }: Partial<InternalQuery<F>>) => {
            setQuery({
                ...query,
                search: search === undefined ? query.search : search,
                sort: sort ? `${sort.field}:${sort.order}` : query.sort,
                ...filters,
            })
        },
        [setQuery, query]
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

// const filters = [
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
//         options: {
//             sort: sortOptions,
//             filter: filters,
//         },
//         defaultSort: "status:asc",
//     })
// }
