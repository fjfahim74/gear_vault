"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import BookingModal from "./BookingModal";
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type Equipment = {
    _id: string;
    name: string;
    description: string;
    category: string;
    rentalPrice: number;
    rentalType: "Daily" | "Weekly" | "Monthly";
    location: string;
    availableQuantity: number;
    imageUrl: string;
    condition: string;
    brand: string;
    model: string;
    rentalTerms: string;
    ownerEmail: string;
    ownerId: string;
    status: string;
};

type Props = {
    equipmentId: string;
};

export default function EquipmentDetailsClient({ equipmentId }: Props) {
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();

    const role = session?.user?.role;

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const token = await getTokenFromClient();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/equipment/${equipmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load equipment details.");
                }

                const data = await response.json();
                setEquipment(data);
            } catch (error) {
                console.error(error);
                setError("Unable to load equipment details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [equipmentId]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error || !equipment) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
                <h2 className="text-2xl font-bold text-base-content">
                    Equipment Not Found
                </h2>

                <p className="text-base-content/60">
                    {error || "This equipment may no longer be available."}
                </p>

                <Link href="/equipment" className="btn btn-primary">
                    Back to Equipment
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-base-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link
                    href="/equipment"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-primary"
                >
                    <ArrowLeft size={18} />
                    Back to Equipment
                </Link>

                <div className="grid gap-10 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-base-300">
                            {equipment.imageUrl ? (
                                <img
                                    src={equipment.imageUrl}
                                    alt={equipment.name}
                                    className="h-72 w-full object-cover sm:h-[450px]"
                                />
                            ) : (
                                <div className="flex h-72 items-center justify-center bg-base-200 text-base-content/50">
                                    No image available
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="mb-2 font-semibold text-primary">
                                {equipment.category}
                            </p>

                            <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
                                {equipment.name}
                            </h1>

                            <p className="mt-4 flex items-center gap-2 text-base-content/60">
                                <MapPin size={18} />
                                {equipment.location}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {[
                                ["Brand", equipment.brand],
                                ["Model", equipment.model],
                                ["Condition", equipment.condition],
                                ["Rental Type", equipment.rentalType],
                                ["Total Inventory", equipment.availableQuantity],
                                ["Location", equipment.location],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl border border-base-300 bg-base-200 p-4"
                                >
                                    <p className="text-sm text-base-content/60">
                                        {label}
                                    </p>
                                    <p className="mt-2 font-semibold text-base-content">
                                        {value || "Not provided"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <section>
                            <h2 className="text-xl font-bold text-base-content">
                                Description
                            </h2>
                            <p className="mt-3 leading-7 text-base-content/70">
                                {equipment.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-base-content">
                                Rental Terms & Conditions
                            </h2>
                            <div className="mt-3 rounded-xl bg-base-200 p-5 leading-7 text-base-content/70">
                                {equipment.rentalTerms || "No rental terms provided."}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-base-content">
                                Equipment Owner
                            </h2>
                            <div className="mt-3 rounded-xl border border-base-300 p-5">
                                <p className="font-semibold text-base-content">
                                    {equipment.ownerEmail}
                                </p>
                                <p className="mt-1 text-sm text-base-content/60">
                                    Equipment Owner
                                </p>
                            </div>
                        </section>
                    </div>

                    <aside className="h-fit rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm lg:sticky lg:top-24">
                        <p className="text-3xl font-bold text-base-content">
                            ${equipment.rentalPrice}
                            <span className="text-sm font-normal text-base-content/60">
                                {" "}/ {equipment.rentalType.toLowerCase()}
                            </span>
                        </p>

                        <div className="mt-5 border-t border-base-300 pt-5">
                            <p className="text-sm text-base-content/60">
                                Total Inventory
                            </p>

                            <p className="mt-2 font-semibold text-base-content">
                                {equipment.availableQuantity > 0
                                    ? `${equipment.availableQuantity} units listed`
                                    : "No inventory listed"}
                            </p>

                            <p className="mt-1 text-xs text-base-content/50">
                                Select rental dates to check actual availability.
                            </p>
                        </div>

                        <div className="mt-5 border-t border-base-300 pt-5">
                            <p className="text-sm text-base-content/60">
                                Rental Type
                            </p>
                            <p className="mt-2 font-semibold text-base-content">
                                {equipment.rentalType}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsBookingOpen(true)}
                            disabled={
                                isPending ||
                                role !== "Customer" ||
                                equipment.availableQuantity <= 0
                            }
                            title={
                                role !== "Customer" && !isPending
                                    ? "Switch to a customer account to rent equipment."
                                    : ""
                            }
                            className="btn btn-primary mt-6 w-full"
                        >
                            {equipment.availableQuantity > 0
                                ? "Book Now"
                                : "Currently Unavailable"}
                        </button>

                        <div className="mt-5 border-t border-base-300 pt-5">
                            <FavoriteButton equipmentId={equipment._id} />
                        </div>
                    </aside>
                </div>
            </div>
            {isBookingOpen && (
                <BookingModal
                    equipment={equipment}
                    onClose={() => setIsBookingOpen(false)}
                />
            )}
        </main>
    );
}