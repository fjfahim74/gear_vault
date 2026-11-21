import { requireRole } from "@/lib/auth-guard";
import ProfileClient from "@/components/dashboard/ProfileClient";

const AdminProfilePage = async () => {
    await requireRole("Admin");

    return <ProfileClient />;
};

export default AdminProfilePage;