import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-guard";

const CustomerDashboardPage = async () => {
    await requireRole("Customer");

    redirect("/dashboard/customer/rental");
};

export default CustomerDashboardPage;