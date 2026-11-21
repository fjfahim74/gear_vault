import { requireRole } from "@/lib/auth-guard";
import AdminEquipmentClient from "@/components/dashboard/admin/AdminEquipmentClient";

const AdminEquipmentPage = async () => {
    await requireRole("Admin");

    return <AdminEquipmentClient />;
};

export default AdminEquipmentPage;