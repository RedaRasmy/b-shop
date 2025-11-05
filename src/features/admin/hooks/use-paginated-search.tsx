import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryParams2 } from "@/hooks/use-query-params"
import type {
    BasicQuery,
    PaginationQuery,
    Prettify,
    SortOrder,
} from "@/types/global-types"
import { useCallback, useMemo, useState } from "react"

// Helper Types

type FiltersToRecord<T extends FilterOptions> = Prettify<{
    [K in T[number] as K["value"]]?: K extends { nullable: true }
        ? K["options"][number]["value"] | "__NULL__"
        : K["options"][number]["value"]
}>

type PaginatedQuery<
    F extends FilterOptions | undefined,
    DS extends string | undefined
> = Prettify<
    Pick<BasicQuery, "search"> &
        (DS extends string ? { sort: string } : { sort?: string }) &
        PaginationQuery &
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        (F extends FilterOptions ? FiltersToRecord<F> : {})
>

type InternalQuery<
    F extends FilterOptions | undefined,
    DS extends string | undefined
> = Prettify<
    Omit<PaginatedQuery<F, DS>, "sort"> &
        (DS extends undefined
            ? {
                  sort?: {
                      field: string
                      order: SortOrder
                  }
              }
            : {
                  sort: {
                      field: string
                      order: SortOrder
                  }
              })
>

////

type Return<
    F extends FilterOptions,
    S extends SortOptions,
    DS extends string | undefined
> = {
    query: PaginatedQuery<F, DS>
    controls: {
        query: InternalQuery<F, DS>
        setQuery: (query: {
            search?: string
            filters?: Record<string, string>
            sort?: {
                field: string
                order: SortOrder
            }
        }) => void
        options: {
            filter?: Readonly<F>
            sort: S
        }
    }
    page: number
    setPage: (page: number) => void
}

export default function usePaginatedSearch<
    F extends FilterOptions,
    S extends SortOptions,
    DS extends `${S[number]["value"]}:${SortOrder}` | undefined
>({
    pageSize,
    options,
    defaultSort,
}: {
    pageSize?: number
    options: {
        filter?: F
        sort: S
    }
    defaultSort?: DS
}): Return<F, S, DS> {
    // search , sort , ...filters

    const filters = options.filter
        ? options.filter.reduce((acc, filter) => {
              acc[filter.value] = { type: "string" }
              return acc
          }, {} as Record<string, { type: "string" }>)
        : {}

    const [query, setQuery] = useQueryParams2({
        search: { type: "string" },
        sort: { type: "string", default: defaultSort },
        ...filters,
    })

    const debouncedQuery = useDebounce({
        state: query,
    })

    const [field, order] = query.sort
        ? (query.sort.split(":") as [string, SortOrder])
        : defaultSort
        ? (defaultSort.split(":") as [string, SortOrder])
        : []

    const sort =
        field && order
            ? {
                  sort: { field, order },
              }
            : {}

    const [page, setPage] = useState(1)

    const handleSetQuery = useCallback(
        ({
            search,
            sort,
            filters,
        }: {
            search?: string
            filters?: Record<string, string>
            sort?: {
                field: string
                order: SortOrder
            }
        }) => {
            setPage(1)
            setQuery({
                search,
                sort: sort ? sort.field + ":" + sort.order : undefined,
                ...filters,
            })
        },
        [setQuery]
    )

    const finalQuery = useMemo(() => {
        const perPage = pageSize ? { perPage: pageSize } : {}

        const result = {
            ...debouncedQuery,
            page,
            ...perPage,
        } as PaginatedQuery<typeof options.filter, typeof defaultSort>

        return result
    }, [debouncedQuery, pageSize, page, options])

    return {
        query: finalQuery as PaginatedQuery<F, DS>,
        controls: {
            query: {
                ...query,
                ...sort,
            } as InternalQuery<F, DS>,
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
//         defaults: {
//             sort: "price:asc",
//         },
//     })
// }
