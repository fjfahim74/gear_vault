import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const DashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

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