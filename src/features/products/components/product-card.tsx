import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/features/products/products.validation"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
    product: Product
}

export function ProductCard({ product }: Props) {
    const mainImageUrl = product.images[0].url

    const isNew = false

    return (
        <Card className="group relative overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                {isNew && (
                    <Badge
                        variant="default"
                        className="bg-primary text-primary-foreground"
                    >
                        New
                    </Badge>
                )}
            </div>

            <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                >
                    <Heart className="h-4 w-4" />
                </Button>
                {/* <ProductQuickView product={product}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 hover:bg-background"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </ProductQuickView> */}
            </div>

            <Link to={`/products/${product.slug}`}>
                <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden">
                        <img
                            src={mainImageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="p-4 flex flex-col items-start gap-3">
                <div className="w-full">
                    <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                        i < Math.floor(0)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-1">
                            {/* ({product.reviews}) */}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                            ${product.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                            ${product.price}
                        </span>
                    </div>

                    <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
