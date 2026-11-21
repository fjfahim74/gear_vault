import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileClient from "@/components/dashboard/ProfileClient";

const CustomerProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in")
    }

    const role = session.user.role;

    if (role !== "Customer") {
        const role = session.user.role ?? "Customer";
    }

    return <ProfileClient />;
};

export default CustomerProfilePage;