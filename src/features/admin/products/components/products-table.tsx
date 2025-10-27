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
import type { Prettify } from "@/types/global-types"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

type TableProduct = Prettify<AdminProduct & { categoryName?: string }>

type Props = {
    products: TableProduct[]
    onUpdate: (id: string) => void
    onDelete: (id: string) => void
}

export default function ProductsTable({ products, onUpdate, onDelete }: Props) {
    //// Columns per screen :
    // +xl : 7 (all)
    // +lg : 6 (stock-status removed)
    // +md : 5 (status removed)
    // +sm : 4 (stock removed)
    // else (in phone) : name , price , actions

    return (
        <Table className="">
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
                            {product.categoryName ? (
                                product.categoryName
                            ) : (
                                <span className="text-destructive font-semibold">
                                    (deleted)
                                </span>
                            )}
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
                                    onClick={() => onUpdate(product.id)}
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
                                            onClick={() => onUpdate(product.id)}
                                        >
                                            <Edit className="h-4 w-4 mr-2 hover:text-white" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => onDelete(product.id)}
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
