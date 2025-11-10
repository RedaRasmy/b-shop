import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function GlobalErrorPage() {
    return (
        <div className="flex flex-col items-center h-screen justify-center space-y-6">
            <h1 className="text-3xl">Something went wrong</h1>
            <Button asChild>
                <Link to={"/"}>Go Back To Home</Link>
            </Button>
        </div>
    )
}
