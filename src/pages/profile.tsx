import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddressesTab from "@/features/profile/components/addresses-tab"
import ProfileTab from "@/features/profile/components/profile-tab"
import SettingsTab from "@/features/profile/components/settings-tab"
import { useSearchParams } from "react-router-dom"

export default function ProfilePage() {
    const [searchParams, setSearchParams] = useSearchParams()

    const activeTab = searchParams.get("tab") || "profile"

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value })
    }
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Account</h1>

            <Tabs
                className="space-y-6"
                defaultValue="profile"
                value={activeTab}
                onValueChange={handleTabChange}
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <ProfileTab />
                </TabsContent>

                <TabsContent value="orders">orders</TabsContent>

                <TabsContent value="addresses">
                    <AddressesTab />
                </TabsContent>

                <TabsContent value="settings">
                    <SettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
