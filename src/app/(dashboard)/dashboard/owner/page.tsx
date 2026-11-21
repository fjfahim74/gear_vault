import { getCurrentSession } from "@/lib/auth-guard";
import OwnerDashboardClient from "@/components/dashboard/owner/OwnerDashboardClient";

const OwnerDashboardPage = async () => {
    const session = await getCurrentSession();

    return (
        <OwnerDashboardClient userName={session.user.name || "Owner"} />
    );
};

export default OwnerDashboardPage;