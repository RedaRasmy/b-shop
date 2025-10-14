import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CartItem } from "@/redux/slices/cart"
import { Minus, Plus, Trash2 } from "lucide-react"

type Props = {
    items: CartItem[]
    onRemove: (id: string) => void
    onPlus: (id: string) => void
    onMinus: (id: string) => void
}

export function CartItems({ items, onMinus, onPlus, onRemove }: Props) {
    return (
        <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
                <Card key={item.id}>
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <img
                                src={item.thumbnailUrl}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-md"
                            />

                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {item.name}
                                        </h3>
                                        {item.inventoryStatus ===
                                            "Out of Stock" && (
                                            <Badge
                                                variant="destructive"
                                                className="mt-1"
                                            >
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(item.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-primary">
                                            ${item.price}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onMinus(item.id)}
                                            disabled={
                                                item.inventoryStatus ===
                                                "Out of Stock"
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-3 py-1 border rounded min-w-[3rem] text-center">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPlus(item.id)}
                                            disabled={
                                                item.inventoryStatus ===
                                                "Out of Stock"
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="font-semibold">
                                        Total: $
                                        {(item.price * item.quantity).toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
