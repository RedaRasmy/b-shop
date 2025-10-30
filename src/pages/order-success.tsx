import { Link, useParams } from "react-router-dom"
import { CheckCircle, Package, Home, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { fetchOrder } from "@/features/order/api/requests"
import LoadingPage from "@/pages/loading"
import NotFoundPage from "@/pages/not-found"
import { useAuth } from "@/features/auth/use-auth"
import { orderKeys } from "@/features/order/query-keys"

export default function OrderSuccessPage() {
    const params = useParams()
    const token = params.token!
    const { isAuthenticated, isLoading } = useAuth()

    const { data: order, isError } = useQuery({
        queryKey: orderKeys.success(token),
        queryFn: () => fetchOrder(token),
        retry: false,
    })

    if (isError) return <NotFoundPage />
    if (!order || isLoading) return <LoadingPage />

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="text-center mb-8 space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <CheckCircle
                                className="h-24 w-24 text-success animate-in zoom-in duration-500"
                                color="green"
                            />
                            <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">
                        Order Confirmed!
                    </h1>
                </div>

                <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                    <CardHeader className="bg-gradient-card">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Details
                        </CardTitle>
                        <CardDescription>
                            Your order has been successfully placed and is being
                            processed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Order Number
                                </p>
                                <p className="font-mono font-semibold text-lg">
                                    #{order.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Total Amount
                                </p>
                                <p className="font-semibold text-lg">
                                    ${order.total}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                What's Next?
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">
                                        •
                                    </span>
                                    <span>
                                        You'll receive an order confirmation
                                        email shortly
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">
                                        •
                                    </span>
                                    <span>
                                        We'll notify you when your order ships
                                    </span>
                                </li>
                                {isAuthenticated && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">
                                            •
                                        </span>
                                        <span>
                                            Track your order status in your
                                            profile
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <Separator />

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                asChild
                                variant="default"
                                className="flex-1"
                            >
                                <Link to="/products">
                                    <Home className="h-4 w-4" />
                                    Continue Shopping
                                </Link>
                            </Button>
                            {isAuthenticated && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Link to="/profile?tab=orders">
                                        <Package className="h-4 w-4" />
                                        View Orders
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* <p className="text-center text-sm text-muted-foreground mt-8">
                    Need help? Contact our customer support at{" "}
                    <a
                        href="mailto:support@example.com"
                        className="text-primary hover:underline"
                    >
                        support@example.com
                    </a>
                </p> */}
            </div>
        </main>
    )
}
