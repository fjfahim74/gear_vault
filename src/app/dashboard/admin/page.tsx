import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const AdminDashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Admin") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
};

export default AdminDashboardPage;