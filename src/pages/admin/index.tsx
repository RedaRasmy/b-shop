import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/use-auth"
import { NavLink, Outlet } from "react-router-dom"
import { AppSidebar } from "../../features/admin/components/app-sidebar"
import { LogOut } from "lucide-react"
// import { Shield } from "lucide-react"

export default function AdminLayout() {
    const { logout } = useAuth()

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen">
                <div className="border-b h-15 justify-between pl-2 pr-4 lg:pr-7 border-black/10 w-full min-h-10 flex items-center">
                    <div className="flex gap-20 ">
                        <SidebarTrigger />
                        {/* <div className="text-accent gap-1 flex items-center font-semibold">
                            <Shield className="text-accent" size={20}/>
                            Admin Panel
                        </div> */}
                    </div>
                    <div className="flex gap-2 md:gap-3 lg:gap-4">
                        <Button
                            onClick={logout}
                            variant={"outline"}
                            className="cursor-pointer"
                        >
                            <LogOut/>
                            Log out
                        </Button>
                        <Button
                            className="cursor-pointer"
                            variant={"outline"}
                            asChild
                        >
                            <NavLink to={"/"}>Shop</NavLink>
                        </Button>
                    </div>
                </div>
                <div className="px-3 md:px-4 h-[calc(100%-3.75rem)] lg:px-6 py-2 md:py-3 lg:py-5">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}
