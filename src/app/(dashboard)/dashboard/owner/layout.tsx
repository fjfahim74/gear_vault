import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const OwnerLayout = async ({
    children,
}: {
    children: ReactNode;
}) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Owner") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return <>{children}</>;
};

export default OwnerLayout;