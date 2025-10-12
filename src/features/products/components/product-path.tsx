type Props = {
    base?: string
    category: string
    name: string
}

export default function ProductPath({ base = "Home", category, name }: Props) {
    return (
        <nav className="text-sm text-muted-foreground mb-8">
            <span>{base}</span> / <span>{category}</span> /{" "}
            <span className="text-foreground">{name}</span>
        </nav>
    )
}
