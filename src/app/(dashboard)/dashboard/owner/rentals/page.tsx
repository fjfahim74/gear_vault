import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OwnerRentalsClient from "@/components/dashboard/owner/OwnerRentalsClient";

const OwnerRentalsPage = async () => {
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

    return <OwnerRentalsClient />;
};

export default OwnerRentalsPage;