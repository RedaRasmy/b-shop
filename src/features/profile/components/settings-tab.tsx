import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { LogOut, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { PasswordSchema } from "@/features/auth/auth.validation"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { updatePassword } from "@/features/profile/profile-requests"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useState } from "react"

type FormData = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

const Schema = z
    .object({
        oldPassword: PasswordSchema,
        newPassword: PasswordSchema,
        confirmPassword: PasswordSchema,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        error: "New passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        error: "The new password must be different from the old one.",
        path: ["newPassword"],
    })

export default function SettingsTab() {
    const [message, setMessage] = useState<undefined | string>(undefined)
    const form = useForm({
        resolver: zodResolver(Schema),
    })
    const { logout } = useAuth()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: updatePassword,
        onError: (err: AxiosError<{ message: string }>) => {
            form.setError("root", {
                message:
                    (err.response?.data.message as string) ||
                    "Something went wrong",
            })
            setMessage(undefined)
        },
        onSuccess: () => {
            setMessage("The password has been updated successfully.")
        },
    })

    async function onSubmit(data: FormData) {
        await mutateAsync({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        })
    }

    const error = form.formState.errors.root?.message

    return (
        <TabsContent value="settings">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogOut className="h-5 w-5" />
                            Account Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={logout}>
                            Logout
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Account Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                {error && (
                                    <p className="text-destructive">{error}</p>
                                )}
                                {message && (
                                    <p className="text-green-600">{message}</p>
                                )}
                                <FormField
                                    control={form.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Current Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm New Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isPending} type="submit">
                                    Update Password
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    )
}
