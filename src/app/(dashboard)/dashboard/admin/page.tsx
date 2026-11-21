import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import AdminDashboardClient from "@/components/dashboard/admin/AdminDashboardClient";

const AdminDashboardPage = async () => {
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
        <AdminDashboardClient userName={session.user.name} />
    );
};

export default AdminDashboardPage;