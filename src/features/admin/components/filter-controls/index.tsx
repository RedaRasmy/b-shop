import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FilterDropdown from "@/features/admin/components/filter-controls/filter-dropdown"
import AdminSearchInput from "@/features/admin/components/filter-controls/search-input"
import SortDropdown from "@/features/admin/components/filter-controls/sort-dropdown"
import type { SortOrder } from "@/types/global-types"
import { X } from "lucide-react"
import { useState } from "react"

export type FilterOptions = {
    label: string
    value: string
    options: { label: string; value: string }[]
    nullable?: boolean
}[]

export type SortOptions = { label: string; value: string }[]

type Props = {
    searchTerm: string
    onSearchChange: (value: string) => void
    filterOptions?: FilterOptions
    activeFilters: Record<string, string>
    onFilterChange: (key: string, value: string) => void
    onClearFilters: () => void
    sortBy: string
    sortOrder: SortOrder
    onSortChange: (field: string, order: SortOrder) => void
    sortOptions: SortOptions
}

export default function FilterControls({
    activeFilters,
    onClearFilters,
    onFilterChange,
    onSearchChange,
    onSortChange,
    searchTerm,
    sortBy,
    sortOptions,
    sortOrder,
    filterOptions = [],
}: Props) {
    const [filtersOpen, setFiltersOpen] = useState(false)

    const activeFilterCount =
        Object.values(activeFilters).filter(Boolean).length

    return (
        <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <AdminSearchInput
                    onChange={onSearchChange}
                    value={searchTerm}
                />

                <div className="flex gap-2">
                    <FilterDropdown
                        activeFilters={activeFilters}
                        options={filterOptions}
                        onClear={onClearFilters}
                        onFilterChange={onFilterChange}
                        onOpenChange={setFiltersOpen}
                        open={filtersOpen}
                    />

                    {/* Sort */}
                    <SortDropdown
                        onChange={onSortChange}
                        sortBy={sortBy}
                        order={sortOrder}
                        sortOptions={sortOptions}
                    />
                </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                        if (!value) return null
                        const filter = filterOptions.find(
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
                                    onClick={() => onFilterChange(key, "")}
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
