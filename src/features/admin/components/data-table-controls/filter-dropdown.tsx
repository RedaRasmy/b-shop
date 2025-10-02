import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { FilterOption } from "@/features/admin/components/data-table-controls"
import { Filter } from "lucide-react"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFilterChange: (key: string, value: string) => void
    filters?: FilterOption[]
    activeFilters: Record<string, string>
    onClear: () => void
}

export default function FilterDropdown({
    open,
    onOpenChange,
    filters = [],
    activeFilters,
    onFilterChange,
    onClear,
}: Props) {
    const activeFilterCount =
        Object.values(activeFilters).filter(Boolean).length
    return (
        filters.length > 0 && (
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-2 h-5 w-5 p-0 text-xs"
                            >
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Filters</h4>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClear}
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>
                        {filters.map((filter) => (
                            <div key={filter.value} className="space-y-2">
                                <label className="text-sm font-medium">
                                    {filter.label}
                                </label>
                                {filter.type === "select" && filter.options ? (
                                    <Select
                                        value={
                                            activeFilters[filter.value] || ""
                                        }
                                        onValueChange={(value) =>
                                            onFilterChange(filter.value, value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={`Select ${filter.label.toLowerCase()}`}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filter.options.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        placeholder={`Filter by ${filter.label.toLowerCase()}`}
                                        value={
                                            activeFilters[filter.value] || ""
                                        }
                                        onChange={(e) =>
                                            onFilterChange(
                                                filter.value,
                                                e.target.value
                                            )
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        )
    )
}
