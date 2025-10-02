import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Order } from "@/lib/types"
import { SortAsc, SortDesc } from "lucide-react"

type Option = { label: string; value: string }

type Props = {
    sortBy: string
    order: "asc" | "desc"
    onChange: (field: string, order: "asc" | "desc") => void
    sortOptions: Option[]
}

export default function SortDropdown({
    onChange,
    order,
    sortBy,
    sortOptions,
}: Props) {
    function isDate(str: string) {
        return ["createdAt", "updatedAt"].includes(str)
    }
    function isNumber(str: string) {
        return ["price", "stock"].includes(str)
    }

    function getOrderAsc(str: string) {
        if (isDate(str)) {
            return "(older)"
        } else if (isNumber(str)) {
            return "(lower)"
        } else {
            return "(A-Z)"
        }
    }
    function getOrderDesc(str: string) {
        if (isDate(str)) {
            return "(newer)"
        } else if (isNumber(str)) {
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
                onChange(field, order as Order)
            }}
        >
            <SelectTrigger className="w-full max-w-[300px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {sortOptions.map((option) => (
                    <div key={option.value}>
                        <SelectItem value={`${option.value}-asc`}>
                            <div className="flex items-center">
                                <SortAsc className="h-4 w-4 mr-2" />
                                {option.label}{" "}
                                {getOrderAsc(option.value)}
                            </div>
                        </SelectItem>
                        <SelectItem value={`${option.value}-desc`}>
                            <div className="flex items-center">
                                <SortDesc className="h-4 w-4 mr-2" />
                                {option.label}{" "}
                                {getOrderDesc(option.value)}
                            </div>
                        </SelectItem>
                    </div>
                ))}
            </SelectContent>
        </Select>
    )
}
