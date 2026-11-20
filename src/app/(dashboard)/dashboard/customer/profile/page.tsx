import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const CustomerProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role;

    if (role !== "Customer") {
        if (role === "Owner" || role === "Admin") {
            redirect(`/dashboard/${role.toLowerCase()}`);
        }

        redirect("/sign-in");
    }

    return (
        <div>
            <h1>My Profile</h1>
        </div>
    );
};

export default CustomerProfilePage;