import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UsersClient from "@/components/dashboard/admin/UsersClient";

const AdminUsersPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in")
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Admin") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return (
        <UsersClient currentUserId={session.user.id} />
    );
};

export default AdminUsersPage;