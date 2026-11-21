import { requireRole } from "@/lib/auth-guard";
import AdminEditEquipmentClient from "@/components/dashboard/admin/AdminEditEquipmentClient";

const AdminEditEquipmentPage = async () => {
    await requireRole("Admin");

    return <AdminEditEquipmentClient />;
};

export default AdminEditEquipmentPage;