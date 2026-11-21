import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OwnerDashboardClient from "@/components/dashboard/owner/OwnerDashboardClient";

const OwnerDashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Owner") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return (
        <OwnerDashboardClient userName={session.user.name || "Owner"} />
    );
};

export default OwnerDashboardPage;