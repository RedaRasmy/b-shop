import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
    value: string
    onChange: (value: string) => void
}

export default function AdminSearchInput({ value, onChange }: Props) {
    const [text, setText] = useState(value)

    useEffect(() => {
        setText(value)
    }, [value])

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                placeholder="Search..."
                value={text}
                onChange={(e) => {
                    setText(e.target.value)
                    if (e.target.value !== value) {
                        onChange(e.target.value)
                    }
                }}
                className="pl-10"
            />
        </div>
    )
}
