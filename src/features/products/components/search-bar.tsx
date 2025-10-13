import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    placeholder="Search products..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg rounded-full border-2 focus:border-primary/50 shadow-sm"
                />
            </div>
        </div>
    )
}
