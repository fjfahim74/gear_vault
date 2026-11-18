import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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
        <div>
            <h1>Owner Dashboard</h1>
        </div>
    );
};

export default OwnerDashboardPage;