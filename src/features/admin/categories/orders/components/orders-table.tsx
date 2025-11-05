import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { AdminOrder } from "@/features/order/types"
import { cn } from "@/lib/utils"

type Props = {
    orders?: AdminOrder[]
    onUpdate: ({
        id,
        status,
    }: {
        id: number
        status: AdminOrder["status"]
    }) => void
    isUpdating: boolean
}

export default function OrdersTable({
    orders = [],
    onUpdate,
    isUpdating,
}: Props) {
    return (
        <div
            className={cn("flex flex-col gap-3 overflow-auto", {
                "opacity-50": isUpdating,
            })}
        >
            {orders.map((order) => (
                <Card key={order.id} className="">
                    <CardContent className="px-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="font-semibold text-foreground">
                                        #{order.id}
                                    </h3>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) =>
                                            onUpdate({
                                                id: order.id,
                                                status: value as AdminOrder["status"],
                                            })
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
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
