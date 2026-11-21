import { requireRole } from "@/lib/auth-guard";
import ProfileClient from "@/components/dashboard/ProfileClient";

const CustomerProfilePage = async () => {
    await requireRole("Customer");

    return <ProfileClient />;
};

export default CustomerProfilePage;