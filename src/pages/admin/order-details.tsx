import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Mail,
    ShoppingCart,
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import z from "zod"
import { useAdminOrder } from "@/features/order/api/queries"
import LoadingPage from "@/pages/loading"
import { useUpdateOrder } from "@/features/order/api/mutations"
import type { AdminOrder } from "@/features/order/types"

export default function OrderDetailsPage() {
    const { id: stringId } = useParams()

    const id = z.coerce.number().parse(stringId)

    const { data: order } = useAdminOrder(id)

    const { mutate } = useUpdateOrder()

    function handleStatusChange(status: string) {
        mutate({
            id,
            status: status as AdminOrder["status"],
        })
    }

    if (!order) return <LoadingPage />

    return (
        <div className="space-y-6 pb-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2 ">
                    <Button variant="outline" className="mb-5" asChild>
                        <Link to="/admin/orders">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-semibold text-foreground">
                            #{order.id}
                        </h1>
                        <Badge
                            className="text-sm px-3 py-1 capitalize"
                        >
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Order placed on {order.createdAt.toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select
                        value={order.status}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">
                                Processing
                            </SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" asChild>
                        <a
                            href={`mailto:${order.email}?subject=BShop: order-${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Send Email
                        </a>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ShoppingCart className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Price
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.thumbnailUrl}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                    <span className="font-medium">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ${item.priceAtPurchase}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                $
                                                {(
                                                    Number(
                                                        item.priceAtPurchase
                                                    ) * item.quantity
                                                ).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    Total
                                </span>
                                <span className="text-xl font-bold text-primary">
                                    ${order.total}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Customer Info */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Full Name
                                        </p>
                                        <p className="font-medium">
                                            {order.name}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Email Address
                                        </p>
                                        <p className="font-medium break-all text-sm">
                                            {order.email}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Phone Number
                                        </p>
                                        <p className="font-medium">
                                            {order.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    City
                                </p>
                                <p className="font-medium">{order.city}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Street
                                </p>
                                <p className="font-medium">
                                    {order.addressLine1}
                                </p>
                            </div>
                            {order.addressLine2 && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Address 2
                                        </p>
                                        <p className="font-medium">
                                            {order.addressLine2}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
