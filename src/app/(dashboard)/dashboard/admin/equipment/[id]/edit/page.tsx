import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminEditEquipmentClient from "@/components/dashboard/admin/AdminEditEquipmentClient";

const AdminEditEquipmentPage = async () => {
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

    return <AdminEditEquipmentClient />;
};

export default AdminEditEquipmentPage;