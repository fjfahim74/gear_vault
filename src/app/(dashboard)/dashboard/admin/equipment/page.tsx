import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminEquipmentClient from "@/components/dashboard/admin/AdminEquipmentClient";

const AdminEquipmentPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Admin") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return <AdminEquipmentClient />;
};

export default AdminEquipmentPage;