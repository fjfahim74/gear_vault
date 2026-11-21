import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getCurrentSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return session;
};

export const requireRole = async (
    requiredRole: "Customer" | "Owner" | "Admin"
) => {
    const session = await getCurrentSession();
    const role = session.user.role ?? "Customer";

    if (role !== requiredRole) {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return session;
};