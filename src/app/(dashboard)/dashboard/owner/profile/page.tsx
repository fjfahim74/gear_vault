import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileClient from "@/components/dashboard/ProfileClient";

const OwnerProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const role = session.user.role;

    if (role !== "Owner") {
        const role = session.user.role ?? "Owner";
    }

    return <ProfileClient />;
};

export default OwnerProfilePage;