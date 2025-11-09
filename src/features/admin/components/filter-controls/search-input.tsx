import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function AdminSearchInput({
    value,
    onChange,
    placeholder,
}: Props) {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                placeholder={placeholder ?? "Search..."}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                }}
                className="pl-10"
            />
        </div>
    )
}
