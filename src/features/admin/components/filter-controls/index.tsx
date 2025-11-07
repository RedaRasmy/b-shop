import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FilterDropdown from "@/features/admin/components/filter-controls/filter-dropdown"
import AdminSearchInput from "@/features/admin/components/filter-controls/search-input"
import SortDropdown from "@/features/admin/components/filter-controls/sort-dropdown"
import type { SortOrder } from "@/types/global-types"
import { X } from "lucide-react"
import { useState } from "react"

export type Option = {
    readonly label: string
    readonly value: string
}

export type FilterOptions = readonly Readonly<{
    label: string
    value: string
    options: readonly Option[]
    nullable?: boolean
}>[]

export type SortOptions = readonly Option[]

type Query = {
    search?: string
    filters?: Record<string, string | null | undefined>
    sort: {
        field: string
        order: SortOrder
    }
}

type Props = {
    options: {
        filter?: FilterOptions
        sort: SortOptions
    }
    query: Query
    setQuery: (query: Partial<Query>) => void
}

function nullObj(obj: Record<string, string | null | undefined>): Record<string, null> {
    return Object.fromEntries(Object.keys(obj).map((key) => [key, null]))
}

export default function Filters({
    options,
    query: { search = "", filters = {}, sort },
    setQuery,
}: Props) {
    const [filtersOpen, setFiltersOpen] = useState(false)

    const activeFilterCount = Object.values(filters).filter(Boolean).length

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <AdminSearchInput
                    onChange={(search) =>
                        setQuery({
                            search,
                        })
                    }
                    value={search}
                />

                <div className="flex gap-2">
                    {/* Filter */}
                    {options.filter && (
                        <FilterDropdown
                            activeFilters={filters}
                            options={options.filter}
                            onClear={() =>
                                setQuery({ filters: nullObj(filters) })
                            }
                            onFilterChange={(key, value) =>
                                setQuery({
                                    filters: {
                                        [key]: value,
                                    },
                                })
                            }
                            onOpenChange={setFiltersOpen}
                            open={filtersOpen}
                        />
                    )}

                    {/* Sort */}
                    <SortDropdown
                        onChange={(field, order) => {
                            setQuery({
                                sort: {
                                    field,
                                    order,
                                },
                            })
                        }}
                        sortBy={sort.field}
                        order={sort.order}
                        sortOptions={options.sort}
                    />
                </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && options.filter && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value) return null
                        const filter = options.filter?.find(
                            (f) => f.value === key
                        )
                        return (
                            <Badge
                                key={key}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {filter?.label}: {value}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-1"
                                    onClick={() =>
                                        setQuery({
                                            filters: { [key]: null },
                                        })
                                    }
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
