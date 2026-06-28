import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { profileKeys } from "@/features/profile/query-keys"
import { updateProfile } from "@/features/profile/api/requests"
import { ProfileInfosSchema } from "@/features/profile/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useProfile } from "@/features/profile/api/queries"

type FormState = {
    fullName: string
    phone: string
}

export default function ProfileTab() {
    const queryClient = useQueryClient()
    const { data: profile, isLoading } = useProfile()

    const form = useForm<FormState>({
        resolver: zodResolver(ProfileInfosSchema),
        defaultValues: {
            fullName: profile?.fullName || "",
            phone: profile?.phone || "",
        },
    })

    useEffect(() => {
        console.log("profile-tab useEffect")
        if (profile) {
            form.reset({
                fullName: profile.fullName || "",
                phone: profile.phone || "",
            })
        }
    }, [profile, form])

    const { mutateAsync, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: profileKeys.me(),
            })
        },
        onError: (err) => {
            form.setError("root", { message: err.message })
        },
    })

    const error = form.formState.errors.root?.message

    async function onSubmit(data: FormState) {
        try {
            if (
                data.fullName === profile?.fullName &&
                data.phone === profile.phone
            )
                return

            await mutateAsync({
                fullName: data.fullName,
                phone: data.phone,
            })
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading || !profile) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 "
                >
                    <p className="text-destructive">{error}</p>
                    <Controller
                        name="fullName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="full-name">
                                    Full Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="full-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your full name"
                                    type="text"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input disabled id="email" value={profile.email} />
                    </Field>
                    <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input
                                    {...field}
                                    id="phone"
                                    aria-invalid={fieldState.invalid}
                                    type="tel"
                                    placeholder="Enter your phone number"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <div className="flex mt-6">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={isPending}
                        >
                            Save changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
