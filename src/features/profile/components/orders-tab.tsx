import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import { useOrders } from "@/features/order/api/queries"

export default function OrdersTab() {
    const { data: orders } = useOrders()

    if (!orders) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 ">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold">
                                        Order #{order.id}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Placed on{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Badge
                                        variant={
                                            order.status === "completed"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                    <p className="font-semibold mt-1">
                                        ${order.total}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.productName} × {item.quantity}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                Number(item.priceAtPurchase) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleOrderAction(
                                            "View Details",
                                            order.id
                                        )
                                    }
                                >
                                    View Details
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleOrderAction(
                                            "Track Order",
                                            order.id
                                        )
                                    }
                                >
                                    Track Order
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleOrderAction("Reorder", order.id)
                                    }
                                >
                                    Reorder
                                </Button>
                            </div> */}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
