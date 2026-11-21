import { requireRole } from "@/lib/auth-guard";
import AdminRentalsClient from "@/components/dashboard/admin/AdminRentalsClient";

const AdminRentalsPage = async () => {
    await requireRole("Admin");

    return <AdminRentalsClient />;
};

export default AdminRentalsPage;