import { requireRole } from "@/lib/auth-guard";
import MyRentalsClient from "@/components/dashboard/customer/MyRentalsClient";

const MyRentalsPage = async () => {
    await requireRole("Customer");

    return <MyRentalsClient />;
};

export default MyRentalsPage;