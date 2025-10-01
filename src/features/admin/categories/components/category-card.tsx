import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import { UpdateCategoryDialog } from "@/features/admin/categories/components/update-categorie-dialog"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import { useMutation } from "@tanstack/react-query"
import { deleteCategory } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import { useState } from "react"

type Props = {
    category: AdminCategory
}
export default function CategoryCard({ category }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const createdAt = format(category.createdAt, "yyyy-MM-dd")

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-categories"],
            })
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
        },
        onError: () => {
        },
    })

    async function handleDelete() {
        await mutateAsync(category.id)
    }

    return (
        <Card
            key={category.id}
            className="hover:shadow-hover transition-all duration-200"
        >
            <DeleteConfirmDialog
                title="Delete Category"
                description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                isLoading={isPending}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground truncate">
                                    {category.name}
                                </h3>
                                <Badge
                                    className="capitalize"
                                    variant={
                                        category.status === "active"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {category.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {category.description}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
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
                                    onClick={() => setIsDeleteOpen(true)}
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
                                {category.productsCount || 0}
                            </span>{" "}
                            products
                        </div>
                        <div className="text-muted-foreground">
                            Created {createdAt}
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <UpdateCategoryDialog category={category}>
                            <Button asChild variant={"outline"}>
                                <div>
                                    <Edit />
                                    Edit
                                </div>
                            </Button>
                        </UpdateCategoryDialog>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                        >
                            <Link
                                to={`/admin/products?category=${category.slug}`}
                            >
                                View Products
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
