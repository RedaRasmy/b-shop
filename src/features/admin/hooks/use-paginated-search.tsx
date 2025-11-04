import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryParams } from "@/hooks/use-query-params"
import type {
    BasicQuery,
    PaginationQuery,
    Prettify,
    SortOrder,
} from "@/types/global-types"
import { useCallback, useMemo, useState } from "react"



type FiltersToRecord<
    T extends FilterOptions,
    N extends string | null = string
> = {
    [K in T[number] as K["value"]]?: K extends { nullable: true }
        ? K["options"][number]["value"] | (N extends string ? "__NULL__" : null)
        : K["options"][number]["value"]
}

type PaginatedQuery<
    F extends FilterOptions | undefined,
    N extends string | null = string
> = Prettify<
    BasicQuery &
        PaginationQuery &
        (F extends FilterOptions
            ? FiltersToRecord<F, N>
            : Record<string, unknown>)
>

type InternalQuery<F extends FilterOptions> = Prettify<
    Omit<PaginatedQuery<F>, "sort"> & {
        sort: {
            field?: string
            order?: SortOrder
        }
    }
>

////

type Return<F extends FilterOptions, S extends SortOptions> = {
    query: PaginatedQuery<F, null>
    controls: {
        query: InternalQuery<F>
        setQuery: (query: {
            search?: string
            filters?: Record<string, string>
            sort: {
                field: string
                order: SortOrder
            }
        }) => void
        options: {
            filter?: F
            sort: S
        }
    }
    page: number
    setPage: (page: number) => void
}

export default function usePaginatedSearch<
    F extends FilterOptions,
    S extends SortOptions
>({
    pageSize,
    options,
    defaults,
}: {
    pageSize?: number
    options: {
        filter?: F
        sort: S
    }
    defaults?: {
        sort?: `${S[number]["value"]}:${SortOrder}`
    }
}): Return<F, S> {
    // search , sort , ...filters

    const filters = options.filter
        ? options.filter.reduce((acc, filter) => {
              acc[filter.value] = undefined
              return acc
          }, {} as Record<string, string | undefined>)
        : {}

    const [query, setQuery] = useQueryParams<
        Prettify<
            {
                search?: string
                sort?: string
            } & typeof filters
        >
    >({
        search: undefined,
        sort: undefined,
        ...filters,
    })

    const debouncedQuery = useDebounce({
        state: query,
    })

    const [field, order] = query.sort
        ? (query.sort.split(":") as [string, SortOrder])
        : defaults?.sort
        ? (defaults.sort.split(":") as [string, SortOrder])
        : []

    const [page, setPage] = useState(1)

    const handleSetQuery = useCallback(
        ({
            search,
            sort,
            filters,
        }: {
            search?: string
            filters?: Record<string, string>
            sort: {
                field: string
                order: SortOrder
            }
        }) => {
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

        // Change __NULL__ to null
        let parsedQuery: PaginatedQuery<F, null> | typeof debouncedQuery

        if (options.filter) {
            const entries = Object.entries(debouncedQuery).map(
                ([key, value]) => {
                    if (key === "search" || key === "sort") return [key, value]
                    if (value === "__NULL__") return [key, null]
                    return [key, value]
                }
            )
            parsedQuery = Object.fromEntries(entries) as PaginatedQuery<F, null>
        } else {
            parsedQuery = debouncedQuery
        }

        // --- Now construct the final query ---
        const result = {
            ...parsedQuery,
            page,
            ...perPage,
        } as PaginatedQuery<F, null>

        return result
    }, [debouncedQuery, pageSize, page, options])

    return {
        query: finalQuery,
        controls: {
            query: {
                ...query,
                sort: { field, order },
            } as InternalQuery<F>,
            setQuery: handleSetQuery,
            options,
        },
        page,
        setPage,
    }
}

//// TEST

// const filters = [
//     {
//         label: "Status",
//         value: "status",
//         options: [
//             { label: "Active", value: "active" },
//             { label: "Inactive", value: "inactive" },
//         ] as const,
//     },
//     {
//         label: "Category",
//         value: "category",
//         options: [
//             { label: "Tech", value: "tech" },
//             { label: "Fashion", value: "fashion" },
//         ] as const,
//         nullable: true,
//     },
// ] as const

// function Compo() {
//     const { query ,controls : {query,options,setQuery} , page,setPage } = usePaginatedSearch({
//         options: {
//             sort: [{ label: "Date", value: "date" }],
//             filter: filters,
//         },
//     })
// }
