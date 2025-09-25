import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const {logout} = useAuth()
    return (
        <div>
            customer profile 
            <Button onClick={logout}>log out</Button>
        </div>
    )
}
