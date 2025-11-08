import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { AdminOrder } from "@/features/order/types"
import { Mail, MapPin, Package, Phone, User } from "lucide-react"

export default function OrderDetailsDialog({
    open,
    onOpenChange,
    order,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    order: AdminOrder
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Order Details
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Order Summary Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Order Summary
                                </CardTitle>
                                <Badge variant={"default"}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Order ID
                                </span>
                                <span className="font-semibold">
                                    {order.id}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Date
                                </span>
                                <span className="font-medium">
                                    {order.createdAt.toLocaleDateString()}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Items
                                </span>
                                <span className="font-medium">
                                    {order.items.length} items
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Total Amount
                                </span>
                                <span className="text-lg font-bold text-primary">
                                    ${order.total}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="font-medium">{order.name}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="font-medium break-all">
                                        {order.email}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        Phone
                                    </p>
                                    <p className="font-medium">{order.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground leading-relaxed">
                                {order.addressLine1}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}
