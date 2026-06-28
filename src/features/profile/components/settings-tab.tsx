import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { LogOut, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { PasswordSchema } from "@/features/auth/validation"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { updatePassword } from "@/features/profile/api/requests"
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

                            <Controller
                                name="oldPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="current-password">
                                            Current Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="current-password"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="newPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="new-password">
                                            New Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="new-password"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm New Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="confirm-password"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Button disabled={isPending} type="submit">
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    )
}
