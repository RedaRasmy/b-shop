import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Order } from "@/lib/types"
import { SortAsc, SortDesc } from "lucide-react"

type Props = {
    sortBy: string
    order: "asc" | "desc"
    onChange: (field: string, order: "asc" | "desc") => void
    sortOptions: { label: string; value: string }[]
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
                                {option.label} {isDate(option.value) ? "(older)" : "(A-Z)"}
                            </div>
                        </SelectItem>
                        <SelectItem value={`${option.value}-desc`}>
                            <div className="flex items-center">
                                <SortDesc className="h-4 w-4 mr-2" />
                                {option.label} {isDate(option.value) ? "(newer)" : "(Z-A)"}
                            </div>
                        </SelectItem>
                    </div>
                ))}
            </SelectContent>
        </Select>
    )
}
