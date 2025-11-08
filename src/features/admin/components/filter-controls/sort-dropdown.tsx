import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { SortOptions } from "@/features/admin/components/filter-controls"
import type { SortOrder } from "@/types/global-types"
import { SortAsc, SortDesc } from "lucide-react"

type Props = {
    sortBy: string
    order: "asc" | "desc"
    onChange: (field: string, order: "asc" | "desc") => void
    sortOptions: SortOptions
}

type Type = "string" | "number" | "date"

export default function SortDropdown({
    onChange,
    order,
    sortBy,
    sortOptions,
}: Props) {
    function getOrderAsc(type?: Type) {
        if (type === "date") {
            return "(older)"
        } else if (type === "number") {
            return "(lower)"
        } else {
            return "(A-Z)"
        }
    }
    function getOrderDesc(type?: Type) {
        if (type === "date") {
            return "(newer)"
        } else if (type === "number") {
            return "(higher)"
        } else {
            return "(Z-A)"
        }
    }

    return (
        <Select
            value={`${sortBy}-${order}`}
            onValueChange={(value) => {
                const [field, order] = value.split("-")
                onChange(field, order as SortOrder)
            }}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {sortOptions.map((option) => (
                    <div key={option.value}>
                        <SelectItem value={`${option.value}-asc`}>
                            <div className="flex items-center">
                                <SortAsc className="h-4 w-4 mr-2" />
                                {option.label} {getOrderAsc(option.type)}
                            </div>
                        </SelectItem>
                        <SelectItem value={`${option.value}-desc`}>
                            <div className="flex items-center">
                                <SortDesc className="h-4 w-4 mr-2" />
                                {option.label} {getOrderDesc(option.type)}
                            </div>
                        </SelectItem>
                    </div>
                ))}
            </SelectContent>
        </Select>
    )
}
