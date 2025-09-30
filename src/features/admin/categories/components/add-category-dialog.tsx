import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    CategoryFormSchema,
    type CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { Plus } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { addCategory } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import type { ChangeEvent } from "react"
import { generateSlug } from "@/utils/generate-slug"

export function AddCategoryDialog() {
    const form = useForm<CategoryFormData>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: "",
            description: "",
            slug: "",
            status: "inactive",
        },
    })

    const { mutateAsync } = useMutation({
        mutationFn: addCategory,
        onSuccess: (data) => {
            console.log("success : ", data)
            queryClient.invalidateQueries({
                queryKey: ["admin-categories", "categories"],
            })
            form.reset()
        },
        onError: (err) => {
            console.log("error : ", err)
        },
    })

    const onSubmit = async (data: CategoryFormData) => await mutateAsync(data)

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        const newName = e.target.value
        form.setValue("name", newName, { shouldValidate: true })
        const slug = generateSlug(newName)
        form.setValue("slug", slug, { shouldValidate: true })
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button asChild>
                    <div>
                        <Plus />
                        Add Category
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogDescription>
                        Add a new product category to organize your inventory.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter category name"
                                            {...field}
                                            onChange={handleNameChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="category-slug"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter category description"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <DialogClose>
                                <Button asChild type="button" variant="outline">
                                    <div>Cancel</div>
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                Add Category
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
