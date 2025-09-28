import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/use-auth"
import { NavLink, Outlet } from "react-router-dom"
import { AppSidebar } from "../../features/admin/components/app-sidebar"
// import { Shield } from "lucide-react"

export default function AdminLayout() {
    const { logout } = useAuth()

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="border-b justify-between pl-2 pr-4 py-2 lg:py-3 border-black/10 w-full min-h-10 flex items-center">
                    <div className="flex gap-20 ">
                        <SidebarTrigger />
                        {/* <div className="text-accent gap-1 flex items-center font-semibold">
                            <Shield className="text-accent" size={20}/>
                            Admin Panel
                        </div> */}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={logout}
                            variant={"default"}
                            className="cursor-pointer"
                        >
                            Log out
                        </Button>
                        <Button
                            className="cursor-pointer"
                            variant={"default"}
                            asChild
                        >
                            <NavLink to={"/"}>Shop</NavLink>
                        </Button>
                    </div>
                </div>
                <div className="px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-5">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}
