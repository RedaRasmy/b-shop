import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AdminCategory } from "@/features/categories/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
    categories: AdminCategory[]
    onUpdate: (id: string) => void
    onDelete: (id: string) => void
    isUpdating: boolean
}

export default function CategoryList({
    categories,
    onDelete,
    onUpdate,
    isUpdating,
}: Props) {
    return (
        <div
            className={cn(
                "grid overflow-y-auto gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
                {
                    "opacity-50": isUpdating,
                }
            )}
            data-testid="category-list"
        >
            {categories.map(
                ({
                    name,
                    id,
                    createdAt,
                    status,
                    description,
                    productsCount,
                    slug,
                }) => (
                    <Card
                        key={id}
                        className="hover:shadow-hover transition-all duration-200"
                    >
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-foreground truncate">
                                                {name}
                                            </h3>
                                            <Badge
                                                className="capitalize"
                                                variant={
                                                    status === "active"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {description}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-label="more actions"
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 ml-2"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() => onDelete(id)}
                                            >
                                                <div className="flex items-center  ">
                                                    <Trash2 className="h-4 w-4 mr-2 text-destructive " />
                                                    Delete
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {productsCount || 0}
                                        </span>{" "}
                                        products
                                    </div>
                                    <div className="text-muted-foreground">
                                        Created{" "}
                                        {format(createdAt, "yyyy-MM-dd")}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        aria-label="edit"
                                        variant={"outline"}
                                        onClick={() => onUpdate(id)}
                                    >
                                        <Edit />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link
                                            to={`/admin/products?category=${slug}`}
                                        >
                                            View Products
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    )
}
