import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import DashboardShellClient from "@/components/dashboard/DashboardShellClient";

const DashboardLayout = async ({
    children
}: {
    children: ReactNode;
}) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const role = session.user.role ?? "Customer";

    if (!["Customer", "Owner", "Admin"].includes(role)) {
        redirect("/login");
    }

    return (
        <DashboardShellClient
            role={role}
            userName={session.user.name || role}
            userImage={session.user.image}
        >
            {children}
        </DashboardShellClient>
    );
};

export default DashboardLayout;