import type {
    FilterOptions,
    SortOptions,
} from "@/features/admin/components/filter-controls"

export function getOptions<
    const T extends {
        filter?: FilterOptions
        sort: SortOptions
    }
>(
    opt: T
): {
    filterOptions: T["filter"]
    sortOptions: T["sort"]
} {
    return {
        filterOptions: opt.filter,
        sortOptions: opt.sort,
    }
}
