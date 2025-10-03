import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { deleteProduct } from "@/features/admin/admin-requests"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import UpdateProductDialog from "@/features/admin/products/components/update-product-dialog"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { queryClient } from "@/main"
import { useMutation } from "@tanstack/react-query"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

type TableProduct = AdminProduct & { categoryName: string }

type Props = {
    products: TableProduct[]
}

export default function ProductsTable({ products }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<null | TableProduct>(
        null
    )

    function openEditDialog(product: TableProduct) {
        setSelectedProduct(product)
        setIsEditOpen(true)
    }

    function openDeleteDialog(product: TableProduct) {
        setSelectedProduct(product)
        setIsDeleteOpen(true)
    }

    const { mutateAsync: handleDelete, isPending } = useMutation({
        mutationFn: () => deleteProduct(selectedProduct!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            })
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
        },
    })

    //// Columns per screen :
    // +xl : 7 (all)
    // +lg : 6 (stock-status removed)
    // +md : 5 (status removed)
    // +sm : 4 (stock removed)
    // else (in phone) : name , price , actions

    return (
        <Table>
            {selectedProduct && (
                <UpdateProductDialog
                    product={selectedProduct}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
            <DeleteConfirmDialog
                title="Delete Product"
                description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                isLoading={isPending}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="not-sm:hidden">Stock</TableHead>
                    <TableHead className="not-lg:hidden">Category</TableHead>
                    <TableHead className="not-md:hidden">Status</TableHead>
                    <TableHead className="not-xl:hidden">
                        Stock Status
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">
                            {product.name}
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell className="not-sm:hidden">
                            {product.stock}
                        </TableCell>
                        <TableCell className="not-lg:hidden">
                            {product.categoryName}
                        </TableCell>
                        <TableCell className="not-md:hidden">
                            <Badge
                                variant={
                                    product.status === "active"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {product.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="not-xl:hidden">
                            <Badge
                                variant={
                                    product.inventoryStatus === "In Stock"
                                        ? "default"
                                        : product.inventoryStatus ===
                                          "Low Stock"
                                        ? "secondary"
                                        : "destructive"
                                }
                            >
                                {product.inventoryStatus}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    title="View Details"
                                >
                                    <Link to={`/products/${product.slug}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(product)}
                                    title="Edit"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-popover"
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to={`/products/${product.slug}`}
                                            >
                                                <Eye className="h-4 w-4 mr-2 hover:text-white" />
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                openEditDialog(product)
                                            }
                                        >
                                            <Edit className="h-4 w-4 mr-2 hover:text-white" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() =>
                                                openDeleteDialog(product)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
