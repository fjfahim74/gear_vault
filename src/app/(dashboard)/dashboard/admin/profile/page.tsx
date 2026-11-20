import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileClient from "@/components/dashboard/ProfileClient";

const AdminProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const role = session.user.role;

    if (role !== "Admin") {
        const role = session.user.role ?? "Admin";
    }

    return <ProfileClient />;
};

export default AdminProfilePage;