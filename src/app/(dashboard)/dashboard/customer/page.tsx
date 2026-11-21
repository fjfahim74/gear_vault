import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const CustomerDashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Customer") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    redirect("/dashboard/customer/rental");
};

export default CustomerDashboardPage;