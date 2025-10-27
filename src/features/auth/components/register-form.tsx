import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { registerRequest } from "@/features/auth/auth-requests"
import { useAuth } from "@/features/auth/use-auth"
import {
    emailPasswordSchema,
    type Credentials,
} from "@/features/auth/auth.validation"

export function RegisterForm() {
    const form = useForm({
        resolver: zodResolver(emailPasswordSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const navigate = useNavigate()

    const { setUser } = useAuth()

    const mutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: (user) => {
            setUser(user)
            if (user.role === "admin") {
                navigate("/admin")
            } else {
                navigate("/profile")
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            const message =
                (err.response?.data?.message as string) ||
                "Something went wrong , Please try again."
            form.setError("root", {
                message,
            })
        },
    })

    async function onSubmit(values: Credentials) {
        try {
            await mutation.mutateAsync(values)
        } catch {
            // Error handled in onError callback
        }
    }

    const errors = form.formState.errors
    const message = errors.root?.message ?? null

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 my-auto place-self-center w-[min(90%,400px)]"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl mb-5 md:mb-10">
                        Create new account
                    </h1>
                    <p className="text-red-500 my-2">{message}</p>
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your password"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row-reverse mt-6">
                    <Button
                        type="submit"
                        className="cursor-pointer"
                        disabled={form.formState.isSubmitting}
                    >
                        Register
                    </Button>
                </div>
            </form>
        </Form>
    )
}
