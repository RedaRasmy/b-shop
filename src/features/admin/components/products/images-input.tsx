import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"
import type { ChangeEventHandler } from "react"

type Props = {
    onChange : ChangeEventHandler<HTMLInputElement>,
    images  : {alt?:string,url:string}[]
    removeImage : (index:number)=>void
    updateImageAlt : (index:number,alt:string) => void
}

export default function ImagesInput({onChange,images,removeImage,updateImageAlt}:Props) {

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onChange}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 5}
                />
                <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center cursor-pointer ${
                        images.length >= 5
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">
                        {images.length >= 5
                            ? "Maximum images reached"
                            : "Click to upload images"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB each
                    </p>
                </label>
            </div>

            {images.length > 0 && (
                <div className="space-y-3">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-3 bg-muted/20"
                        >
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative group flex-shrink-0">
                                    <img
                                        src={image.url}
                                        alt={
                                            image.alt || `Product ${index + 1}`
                                        }
                                        className="w-full sm:w-20 h-20 object-cover rounded border"
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                                            Main
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-sm font-medium mb-1">
                                        Alt Text (Optional)
                                    </label>
                                    <Input
                                        placeholder="Describe this image for accessibility"
                                        value={image.alt}
                                        onChange={(e) =>
                                            updateImageAlt(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    First image will be used as the main product image
                </p>
            )}
        </div>
    )
}
