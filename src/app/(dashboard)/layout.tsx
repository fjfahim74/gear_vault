import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth-guard";
import DashboardShellClient from "@/components/dashboard/DashboardShellClient";

const DashboardLayout = async ({
    children
}: {
    children: ReactNode;
}) => {
    const session = await getCurrentSession();
    const role = session.user.role ?? "Customer";

    if (!(["Customer", "Owner", "Admin"] as string[]).includes(role)) {
        redirect("/sign-in");
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