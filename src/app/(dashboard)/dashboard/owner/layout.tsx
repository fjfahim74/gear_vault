import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth-guard";

const OwnerLayout = async ({
    children,
}: {
    children: ReactNode;
}) => {
    await requireRole("Owner");

    return <>{children}</>;
};

export default OwnerLayout;