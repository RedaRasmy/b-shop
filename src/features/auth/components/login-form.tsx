import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { loginRequest } from "@/features/auth/requests"
import { useAuth } from "@/features/auth/use-auth"
import { Link, useNavigate } from "react-router-dom"
import { CredentialsSchema, type Credentials } from "@/features/auth/validation"
import { useAppSelector } from "@/redux/hooks"
import { selectCart } from "@/redux/slices/cart"
import { mergeCartRequest } from "@/features/cart/api/requests"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Mail, Lock, EyeOff, Eye } from "lucide-react"
import { useState } from "react"

export function LoginForm() {
    const form = useForm({
        resolver: zodResolver(CredentialsSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const navigate = useNavigate()
    const localCart = useAppSelector(selectCart)

    const { setUser } = useAuth()

    const mutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: async (user) => {
            setUser(user)
            // Merge Carts
            if (localCart.length !== 0) {
                await mergeCartRequest(localCart)
            }

            if (user.role === "admin") {
                navigate("/admin")
            } else {
                navigate("/profile")
            }
        },
        onError: (err) => {
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
            // already handled
        }
    }

    const errors = form.formState.errors
    const message = errors.root?.message ?? null

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Home */}
                <Button variant="ghost" asChild className="mb-6">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account to continue shopping
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <p className="text-red-500">{message}</p>
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                    <Input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="Enter your password"
                                                        className="pl-10 pr-10"
                                                        {...field}
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                    size="lg"
                                    disabled={form.formState.isSubmitting}
                                >
                                    Sign in
                                </Button>
                            </form>
                        </Form>

                        {/* Sign Up Link */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                Don't have an account?{" "}
                            </span>
                            <Link
                                to="/auth/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
