import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FilterDropdown from "@/features/admin/components/data-table-controls/filter-dropdown"
import AdminSearchInput from "@/features/admin/components/data-table-controls/search-input"
import SortDropdown from "@/features/admin/components/data-table-controls/sort-dropdown"
import { X } from "lucide-react"
import { useState } from "react"

export type FilterOption = {
    label: string
    value: string
    options: { label: string; value: string }[]
}

type Props = {
    searchTerm: string
    onSearchChange: (value: string) => void
    filters?: FilterOption[]
    activeFilters: Record<string, string>
    onFilterChange: (key: string, value: string) => void
    onClearFilters: () => void
    sortBy: string
    sortOrder: "asc" | "desc"
    onSortChange: (field: string, order: "asc" | "desc") => void
    sortOptions: { label: string; value: string }[]
}

export default function DataTableControls({
    activeFilters,
    onClearFilters,
    onFilterChange,
    onSearchChange,
    onSortChange,
    searchTerm,
    sortBy,
    sortOptions,
    sortOrder,
    filters = [],
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
                        filters={filters}
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
                        const filter = filters.find((f) => f.value === key)
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
                                    onClick={() => onFilterChange(key, '')}
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
