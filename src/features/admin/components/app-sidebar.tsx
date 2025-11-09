import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ShoppingCart, Package, Users, Tag } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"

const items = [
    {
        title: "Products",
        url: "/admin/products",
        icon: Package,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Customers",
        url: "/admin/customers",
        icon: Users,
    },
    {
        title: "Categories",
        url: "/admin/categories",
        icon: Tag,
    },
]

export function AppSidebar() {
    const { setOpenMobile, state, toggleSidebar } = useSidebar()

    useHotkeys("s", toggleSidebar)

    return (
        <Sidebar className="" collapsible="icon">
            <SidebarHeader />
            <SidebarContent className="px-3 py-2 overflow-hidden">
                <SidebarMenu>
                    {state !== "collapsed"
                        ? items.map((item) => (
                              <NavLink
                                  onClick={() => setOpenMobile(false)}
                                  key={item.url}
                                  to={item.url}
                                  end={item.url === "/admin"}
                                  className={({ isActive }) =>
                                      cn(
                                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                          isActive
                                              ? "bg-primary text-primary-foreground shadow-card"
                                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                      )
                                  }
                              >
                                  <item.icon className="h-4 w-4" />
                                  {item.title}
                              </NavLink>
                          ))
                        : items.map((item) => (
                              <NavLink
                                  onClick={() => setOpenMobile(false)}
                                  key={item.url}
                                  to={item.url}
                                  end={item.url === "/admin"}
                                  className={({ isActive }) =>
                                      cn(
                                          "flex items-center mb-3 justify-center rounded-md size-7 transition-colors",
                                          isActive
                                              ? "bg-primary text-primary-foreground shadow-card"
                                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                      )
                                  }
                              >
                                  <item.icon className="size-5" />
                              </NavLink>
                          ))}
                </SidebarMenu>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
