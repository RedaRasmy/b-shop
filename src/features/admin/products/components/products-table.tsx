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
import { deleteProduct, getCategories, updateProduct } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import ProductForm from "@/features/admin/products/components/product-form"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { queryKeys } from "@/lib/query-keys"
import { queryClient } from "@/main"
import { useMutation, useQuery } from "@tanstack/react-query"
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
    const [selectedId, setSelectedId] = useState<null | string>(null)
    const selectedProduct = products.find((p) => p.id === selectedId)

    function openEditDialog(id: string) {
        setSelectedId(id)
        setIsEditOpen(true)
    }

    function openDeleteDialog(id: string) {
        setSelectedId(id)
        setIsDeleteOpen(true)
    }

    const { mutateAsync: handleDelete, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteProduct(selectedId!),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            })
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            setIsDeleteOpen(false)
            setSelectedId(null)
        },
    })

    
    const { data: categories = [] } = useQuery({
        queryKey: queryKeys.categories.admin(),
        queryFn: () => getCategories(),
        select: (res) => (res.data || []) as AdminCategory[],
    })
    
    const { mutateAsync, isPending: isUpdating } = useMutation({
        mutationFn: (data: FormData) => updateProduct(selectedId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            })
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            setIsEditOpen(false)
            setSelectedId(null)
        },
    })
    
    async function onSubmit(data: FormData) {
        await mutateAsync(data)
    }
    
    //// Columns per screen :
    // +xl : 7 (all)
    // +lg : 6 (stock-status removed)
    // +md : 5 (status removed)
    // +sm : 4 (stock removed)
    // else (in phone) : name , price , actions

    return (
        <Table className="">
            <ProductForm
                key={selectedId}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                categories={categories}
                title="Edit Product"
                description="Update product information."
                buttonText="Update Product"
                onSubmit={onSubmit}
                isSubmitting={isUpdating}
                initialData={selectedProduct}
            />
            <DeleteConfirmDialog
                title="Delete Product"
                description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                isLoading={isDeleting}
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
                                    onClick={() => openEditDialog(product.id)}
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
                                                openEditDialog(product.id)
                                            }
                                        >
                                            <Edit className="h-4 w-4 mr-2 hover:text-white" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() =>
                                                openDeleteDialog(product.id)
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
