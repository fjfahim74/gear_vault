import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyRentalsClient from "@/components/dashboard/customer/MyRentalsClient";

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

    return <MyRentalsClient />;
};

export default MyRentalsPage;