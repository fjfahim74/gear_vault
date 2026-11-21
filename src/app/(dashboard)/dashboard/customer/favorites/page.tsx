import { requireRole } from "@/lib/auth-guard";
import FavoritesClient from "@/components/dashboard/customer/FavoritesClient";

const FavoritesPage = async () => {
    await requireRole("Customer");

    return <FavoritesClient />;
};

export default FavoritesPage;