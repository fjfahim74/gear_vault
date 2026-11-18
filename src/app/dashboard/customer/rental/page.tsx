import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const MyRentalsPage = async () => {
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

    return (
        <div>
            <h1>My Rentals</h1>
        </div>
    );
};

export default MyRentalsPage;