import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryParams2 } from "@/hooks/use-query-params"
import type { Prettify, SortOrder } from "@/types/global-types"
import { useCallback, useMemo, useState } from "react"

// Helper Types
type FiltersToRecord<T extends FilterOptions | undefined> =
    T extends FilterOptions
        ? {
              [K in T[number] as K["value"]]?: K extends { nullable: true }
                  ? K["options"][number]["value"] | "__NULL__"
                  : K["options"][number]["value"]
          }
        : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          {}

// type Query<F extends FilterOptions | undefined> = Prettify<
//     {
//         search?: string
//         sort: string
//     } & FiltersToRecord<F>
// >

type PaginatedQuery<
    F extends FilterOptions | undefined,
    P extends number | undefined
> = Prettify<
    {
        search?: string
        sort: string
        page: number
        perPage: P extends number ? number : number | undefined
    } & FiltersToRecord<F>
>

type InternalQuery<F extends FilterOptions | undefined> = {
    search?: string
    sort: {
        field: string
        order: SortOrder
    }
    filters?: FiltersToRecord<F>
}

type SetQuery<F extends FilterOptions | undefined> = (
    query: Partial<InternalQuery<F>>
) => void

////

type Return<
    F extends FilterOptions | undefined,
    S extends SortOptions,
    P extends number | undefined
> = {
    query: PaginatedQuery<F, P>
    controls: {
        query: InternalQuery<F>
        setQuery: SetQuery<F>
        options: {
            filter?: Readonly<F>
            sort: S
        }
    }
    page: number
    setPage: (page: number) => void
}

export default function usePaginatedSearch<
    F extends FilterOptions | undefined,
    S extends SortOptions,
    P extends number | undefined
>({
    pageSize,
    options,
    defaultSort,
}: {
    pageSize?: P
    options: {
        filter?: F
        sort: S
    }
    defaultSort: `${S[number]["value"]}:${SortOrder}`
}): Return<F, S, P> {
    // search , sort , ...filters

    console.log("runs")

    const queryParamsConfig = useMemo(
        () =>
            ({
                search: { type: "string" },
                sort: { type: "string", default: defaultSort },
                ...(options.filter
                    ? options.filter.reduce((acc, filter) => {
                          acc[filter.value] = { type: "string" }
                          return acc
                      }, {} as Record<string, { type: "string" }>)
                    : {}),
            } as const),
        [defaultSort, options.filter]
    )

    const [query, setQuery] = useQueryParams2(queryParamsConfig)

    const debouncedQuery = useDebounce({
        state: query,
    })

    /// Build Internal Query

    const internalQuery = useMemo(() => {
        const { search, sort, ...queryFilters } = query

        const [field, order] = sort
            ? (query.sort.split(":") as [string, SortOrder])
            : (defaultSort.split(":") as [string, SortOrder])

        return {
            search,
            sort: { field, order },
            filters: queryFilters,
        } as InternalQuery<F>
    }, [query, defaultSort])

    ///

    const [page, setPage] = useState(1)

    const handleSetQuery = useCallback(
        ({ search, sort, filters }: Partial<InternalQuery<F>>) => {
            setPage(1)
            setQuery({
                ...query,
                search: search === undefined ? query.search : search,
                sort: sort ? sort.field + ":" + sort.order : query.sort,
                ...filters,
            })
        },
        [setQuery, query]
    )

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
            options,
        },
        page,
        setPage,
    }
}

// TEST

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
//         page,
//         setPage,
//     } = usePaginatedSearch({
//         options: {
//             sort: sortOptions,
//             filter: filters,
//         },
//         pageSize: 4,
//         defaultSort: "createdAt:asc",
//     })
// }
