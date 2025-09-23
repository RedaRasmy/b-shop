import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AdminPage() {
    const { logout } = useAuth()
    return (
        <div>
            admin page (protected)
            <Button onClick={logout}>log out</Button>
        </div>
    )
}
