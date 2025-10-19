import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProfileInfosSchema } from "@/features/profile/profile.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"

type FormState = {
    fullName: string
    email: string
    phone: string
}

type Props = {
    defaultValues: FormState
}

export default function ProfileTab({ defaultValues }: Props) {
    const form = useForm<FormState>({
        resolver: zodResolver(ProfileInfosSchema),
        defaultValues,
    })

    const message = ""

    // const {data} = useQuery({
    //     queryKey : ['me'],
    //     queryFn : fetchMe
    // })

    function onSubmit() {
        console.log("submit")
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5 my-auto place-self-center w-[min(90%,400px)] not-md:w-full"
                    >
                        <div>
                            <p className="text-red-500 my-2">{message}</p>
                        </div>
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            disabled
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
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row-reverse mt-6">
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                disabled={form.formState.isSubmitting}
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
