import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/features/admin/components/page-header";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
    return (
        <div>
            <AdminPageHeader
                title="Poducts"
                description="Manage your product inventory"
            >
                <Button>
                    <Plus />
                    Add Product
                </Button>
            </AdminPageHeader>
        </div>
    )
}
