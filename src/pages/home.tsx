import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/use-auth"
import useCart from "@/features/cart/hooks/use-cart"
import { ProductCard } from "@/features/products/components/product-card"
import { getProducts } from "@/features/products/product-requests"
import { queryKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Headphones, Shield, Star, Truck } from "lucide-react"
import { Link } from "react-router-dom"

const features = [
    {
        icon: Truck,
        title: "Free Shipping",
        description: "On orders over $50",
    },
    {
        icon: Shield,
        title: "Secure Payment",
        description: "100% secure transactions",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Dedicated customer service",
    },
    {
        icon: Star,
        title: "Quality Products",
        description: "Only the best for you",
    },
]

export default function HomePage() {
    const { data: products = [] } = useQuery({
        queryKey: queryKeys.products.customer(),
        queryFn: () =>
            getProducts({
                perPage: 4,
            }),
        select: (res) => {
            return res.data
        },
    })

    const { isAuthenticated } = useAuth()
    const { addItem } = useCart(isAuthenticated)

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero">
                <div className="">
                    <div className="grid lg:grid-cols-2 gap-12 items-center bg-accent px-6 py-10 lg:px-10 xl:px-20">
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                                    Discover
                                    <span className="block text-primary-glow">
                                        Amazing
                                    </span>
                                    Products
                                </h1>
                                <p className="text-xl text-primary-foreground/80 max-w-lg">
                                    Shop the latest tech, fashion, and lifestyle
                                    products with unbeatable prices and quality.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="group bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20"
                                    asChild
                                >
                                    <Link to="/products">
                                        Shop Now
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="text-center space-y-4 p-6 "
                        >
                            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                                <feature.icon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold">
                        Featured Products
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover our hand-picked selection of premium products
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <ProductCard
                                product={product}
                                onAddToCart={() => addItem(product.id)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-accent py-20">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                        Join thousands of satisfied customers and discover
                        amazing deals today.
                    </p>
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-background text-primary hover:bg-background/90"
                        asChild
                    >
                        <Link to="/products">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
