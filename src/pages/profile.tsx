import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/features/auth/use-auth"
import ProfileTab from "@/features/profile/components/profile-tab"

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Account</h1>

            <Tabs className="space-y-6" defaultValue="profile">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <ProfileTab />
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">orders</TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses">addresses</TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">settings</TabsContent>
            </Tabs>

            {/* <AddAddressDialog
          open={showAddAddress}
          onOpenChange={setShowAddAddress}
          onAdd={handleAddAddress}
        />

        <EditAddressDialog
          open={showEditAddress}
          onOpenChange={setShowEditAddress}
          address={selectedAddress}
          onEdit={handleEditAddress}
        />

        <DeleteConfirmDialog
          open={showDeleteAddress}
          onOpenChange={setShowDeleteAddress}
          title="Delete Address"
          description="Are you sure you want to delete this address? This action cannot be undone."
          onConfirm={handleDeleteAddress}
        /> */}
        </div>
    )
}
