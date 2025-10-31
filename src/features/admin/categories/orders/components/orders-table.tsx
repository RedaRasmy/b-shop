import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { AdminOrder } from "@/features/order/types"

type Props = {
    orders?: AdminOrder[]
    onUpdate: (id: number, status: AdminOrder["status"]) => void
}

export default function OrdersTable({ orders = [], onUpdate }: Props) {
    return (
        <div className="grid gap-4">
            {orders.map((order) => (
                <Card key={order.id} className="">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                    <h3 className="font-semibold text-foreground">
                                        #{order.id}
                                    </h3>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) =>
                                            onUpdate(
                                                order.id,
                                                value as AdminOrder["status"]
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-[140px] h-7">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="processing">
                                                Processing
                                            </SelectItem>
                                            <SelectItem value="shipped">
                                                Shipped
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="canceled">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                        <div className="text-muted-foreground">
                                            Customer:{" "}
                                            <span className="text-foreground font-medium">
                                                {order.name}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            Total:{" "}
                                            <span className="text-foreground font-medium">
                                                ${order.total}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            Items:{" "}
                                            <span className="text-foreground font-medium">
                                                {order.items.length}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            Date:{" "}
                                            <span className="text-foreground font-medium">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Email:{" "}
                                        <span className="text-foreground">
                                            {order.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Send Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Print Invoice
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div> */}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
