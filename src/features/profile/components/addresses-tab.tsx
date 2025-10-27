import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import { AddressFormDialog } from "@/features/profile/components/address-form-dialog"
import {
    addAddress,
    deleteAddress,
    getAddresses,
    updateAddress,
} from "@/features/profile/requests"
import type { IAddress } from "@/features/profile/validation"
import { queryKeys } from "@/lib/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MapPin } from "lucide-react"
import { useState } from "react"

export default function AddressesTab() {
    const [id, setId] = useState<string | null>(null) // addressID to update/delete
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const queryClient = useQueryClient()

    const { data: addresses } = useQuery({
        queryKey: queryKeys.addresses,
        queryFn: getAddresses,
    })

    const addMutation = useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            setIsAddOpen(false)
            queryClient.invalidateQueries({
                queryKey: queryKeys.addresses,
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: IAddress) => updateAddress({ id: id!, data }),
        onSuccess: () => {
            setId(null)
            setIsEditOpen(false)
            queryClient.invalidateQueries({
                queryKey: queryKeys.addresses,
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            setId(null)
            setIsDeleteOpen(false)
            queryClient.invalidateQueries({
                queryKey: queryKeys.addresses,
            })
        },
    })

    if (addresses)
        return (
            <TabsContent value="addresses">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Saved Addresses
                        </CardTitle>
                        <CardDescription>
                            Manage your shipping and billing addresses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 mb-6">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold">
                                                    {address.label}
                                                </h3>
                                                {address.isDefault && (
                                                    <Badge variant="secondary">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {address.addressLine1}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {address.city}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setId(address.id)
                                                    setIsEditOpen(true)
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setId(address.id)
                                                    setIsDeleteOpen(true)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setIsAddOpen(true)}>
                            Add New Address
                        </Button>
                    </CardContent>
                </Card>

                <AddressFormDialog
                    title="Add New Address"
                    description="Add a new shipping or billing address"
                    buttonText="Add Address"
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    onSubmit={addMutation.mutateAsync}
                    isSubmitting={addMutation.isPending}
                />

                {id && (
                    <AddressFormDialog
                        key={"update-form-dialog:" + id}
                        title="Edit Address"
                        description="Update your address details"
                        buttonText="Save Changes"
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        address={addresses.find((ad) => ad.id === id)}
                        onSubmit={updateMutation.mutateAsync}
                        isSubmitting={updateMutation.isPending}
                    />
                )}

                {id && (
                    <DeleteConfirmDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        title="Delete Address"
                        description="Are you sure you want to delete this address? This action cannot be undone."
                        onConfirm={() => deleteMutation.mutateAsync(id)}
                    />
                )}
            </TabsContent>
        )
}
