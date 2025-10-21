import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div className="w-full h-screen space-y-2 flex flex-col items-center justify-center">
            <h1 className="font-bold text-3xl">404</h1>
            <p className="text-xl mb-5 font-semibold">Page not found!</p>
            <Button>
                <Link to={"/"}>Home</Link>
            </Button>
        </div>
    )
}
