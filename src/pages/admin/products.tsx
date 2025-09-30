
import AdminPageHeader from "@/features/admin/components/page-header";
import AddProductDialog from "@/features/admin/products/components/add-product-dialog";


export default function AdminProductsPage() {
    return (
        <div>
            <AdminPageHeader
                title="Poducts"
                description="Manage your product inventory"
            >
                <AddProductDialog/>
            </AdminPageHeader>
        </div>
    )
}
