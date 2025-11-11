import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Customer } from "@/features/profile/types"
import { cn } from "@/lib/utils"
import { Mail, MoreHorizontal, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function CustomersTable({
    customers,
    isUpdating,
}: {
    customers: Customer[]
    isUpdating: boolean
}) {
    return (
        <div
            className={cn("overflow-auto grid gap-4", {
                "opacity-50": isUpdating,
            })}
        >
            {customers.map((customer) => (
                <Card
                    key={customer.id}
                    className="hover:shadow-hover transition-all duration-200"
                >
                    <CardContent className="px-6 py-1">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground truncate mb-2">
                                        {customer.name ?? "<Unknown>"}
                                    </h3>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span className="truncate">
                                                {customer.email}
                                            </span>
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                <span>{customer.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols- lg:grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-semibold text-foreground">
                                        {customer.orderCount}
                                    </div>
                                    <div className="text-muted-foreground">
                                        Orders
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-foreground">
                                        ${customer.totalSpent}
                                    </div>
                                    <div className="text-muted-foreground">
                                        Total Spent
                                    </div>
                                </div>
                                <div className="text-center ">
                                    <div className="font-semibold text-foreground">
                                        {new Date(
                                            customer.joinedAt
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="text-muted-foreground">
                                        Join Date
                                    </div>
                                </div>
                                <div className="col-span-3 sm:col-span-3 lg:col-span-1 flex justify-center lg:justify-end">
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
                                                <a
                                                    href={`mailto:${customer.email}?subject=BShop`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Send Email
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link
                                                    to={
                                                        "/admin/orders?search=" +
                                                        encodeURIComponent(
                                                            customer.email
                                                        )
                                                    }
                                                >
                                                    View Orders
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
