import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const OwnerRentalsPage = async () => {
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Equipment Rentals</h1>
                <p className="mt-1 text-base-content/60">
                    Manage rental bookings for your equipment.
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Equipment</th>
                            <th>Rental Duration</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Payment Status</th>
                            <th>Booking Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td colSpan={7} className="py-12 text-center">
                                <p className="font-medium">No rental records yet.</p>
                                <p className="mt-1 text-sm text-base-content/50">
                                    Rental records will appear here when customers book your equipment.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerRentalsPage;