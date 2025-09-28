import type { ReactNode } from "react"

type Props = {
    title:string,
    description : string,
    children?: ReactNode
}

export default function AdminPageHeader({
    title,description,children
}:Props) {

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
                <h1 className="font-semibold text-2xl">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    )
}