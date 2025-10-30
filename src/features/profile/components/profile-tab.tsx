import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { profileKeys } from "@/features/profile/query-keys"
import { fetchMe, updateProfile } from "@/features/profile/api/requests"
import { ProfileInfosSchema } from "@/features/profile/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

type FormState = {
    fullName: string
    phone: string
}

export default function ProfileTab() {
    const queryClient = useQueryClient()
    const { data: profile, isLoading } = useQuery({
        queryKey: profileKeys.me(),
        queryFn: fetchMe,
    })

    const form = useForm<FormState>({
        resolver: zodResolver(ProfileInfosSchema),
        defaultValues: {
            fullName: profile?.fullName || "",
            phone: profile?.phone || "",
        },
    })

    useEffect(() => {
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
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5 "
                    >
                        <p className="text-destructive">{error}</p>
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your full name"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            disabled
                            defaultValue={profile.email}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your phone number"
                                            type="tel"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
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
                </Form>
            </CardContent>
        </Card>
    )
}
