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
import type { AdminProduct } from "@/features/admin/products/products.validation"
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
        setIsEditOpen(true)
        setSelectedProduct(product)
    }

    function openDeleteDialog(product: TableProduct) {
        setIsDeleteOpen(true)
        setSelectedProduct(product)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stock Status</TableHead>
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
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.createdAt}</TableCell>
                        <TableCell>
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
                        <TableCell>
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
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                openEditDialog(product)
                                            }
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive"
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
