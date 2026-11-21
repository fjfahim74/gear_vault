import { requireRole } from "@/lib/auth-guard";
import UsersClient from "@/components/dashboard/admin/UsersClient";

const AdminUsersPage = async () => {
    const session = await requireRole("Admin");

    return <UsersClient currentUserId={session.user.id} />;
};

export default AdminUsersPage;