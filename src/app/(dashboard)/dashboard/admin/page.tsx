import { requireRole } from "@/lib/auth-guard";
import AdminDashboardClient from "@/components/dashboard/admin/AdminDashboardClient";

const AdminDashboardPage = async () => {
    const session = await requireRole("Admin");

    return <AdminDashboardClient userName={session.user.name} />;
};

export default AdminDashboardPage;