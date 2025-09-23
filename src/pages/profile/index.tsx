import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const {logout} = useAuth()
    return (
        <div>
            profile : protected page
            <Button onClick={logout}>log out</Button>
        </div>
    )
}
