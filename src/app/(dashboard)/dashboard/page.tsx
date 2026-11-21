import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-guard";

const DashboardPage = async () => {
    const session = await getCurrentSession();
    const role = session.user.role ?? "Customer";

    if (role === "Customer") {
        redirect("/dashboard/customer");
    }

    if (role === "Owner") {
        redirect("/dashboard/owner");
    }

    if (role === "Admin") {
        redirect("/dashboard/admin");
    }

    redirect("/sign-in");
};

export default DashboardPage;