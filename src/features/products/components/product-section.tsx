import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/features/products/products.validation"
import {
    Heart,
    Minus,
    Plus,
    RotateCcw,
    Shield,
    ShoppingCart,
    Star,
    Truck,
} from "lucide-react"
import { useState } from "react"

type Props = {
    product: Product
    onFavoriteChange: (isFavorite: boolean) => void
    isFavorite: boolean
    onAddToCart: (quantity: number) => void
}

export default function ProductSection({
    product,
    isFavorite,
    onFavoriteChange,
    onAddToCart,
}: Props) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const mainImage = product.images[selectedImage]

    return (
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden border">
                    <img
                        src={mainImage.url}
                        alt={mainImage.alt}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex gap-2">
                    {product.images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`size-[20%] md:size-20 rounded-md overflow-hidden border-2 ${
                                selectedImage === index
                                    ? "border-primary"
                                    : "border-transparent"
                            }`}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                        {product.reviewCount > 0 ? (
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i <
                                            Math.floor(product.averageRating)
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                    ({product.reviewCount} reviews)
                                </span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground italic">
                                No reviews yet
                            </span>
                        )}
                        <Badge variant="secondary">
                            {product.inventoryStatus}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">
                        ${product.price}
                    </span>
                </div>

                <p className="text-muted-foreground">{product.description}</p>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="font-medium">Quantity:</label>
                        <div className="flex items-center border rounded-md">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setQuantity((prev) => prev - 1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">
                                {quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setQuantity((prev) => prev + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            size="lg"
                            className="flex-1"
                            onClick={() => onAddToCart(quantity)}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => onFavoriteChange(!isFavorite)}
                            className={
                                isFavorite
                                    ? "text-red-500 border-red-500 hover:bg-red-50"
                                    : "hover:text-red-500 hover:border-red-500"
                            }
                        >
                            <Heart
                                className={`h-5 w-5 ${
                                    isFavorite ? "fill-current" : ""
                                }`}
                            />
                            <span className="ml-2">
                                {isFavorite ? "Saved" : "Save"}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* <Separator /> */}

                {/* Features */}
                {/* <div className="space-y-3">
                    <h3 className="font-semibold">Key Features:</h3>
                    <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2 text-sm"
                            >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div> */}

                {/* Trust Badges */}
                <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>2 Year Warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        <span>30-Day Returns</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
