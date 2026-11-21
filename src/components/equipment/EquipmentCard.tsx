import Link from "next/link";
import { MapPin } from "lucide-react";

type Equipment = {
    _id: string;
    name: string;
    category: string;
    imageUrl: string;
    location: string;
    rentalPrice: number;
    rentalType: "Daily" | "Weekly" | "Monthly";
    availableQuantity?: number;
};

type EquipmentCardProps = {
    equipment: Equipment;
};

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
    const quantity = equipment.availableQuantity;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-lg">

            {/* Equipment Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {equipment.imageUrl ? (
                    <img
                        src={equipment.imageUrl}
                        alt={equipment.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-sm text-base-content/50">
                        No image available
                    </div>
                )}

                <span className="absolute left-3 top-3 rounded-md bg-base-100/90 px-3 py-1 text-xs font-semibold text-base-content">
                    {equipment.category}
                </span>

                {quantity !== undefined && quantity <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-lg bg-base-100 px-3 py-2 text-sm font-semibold text-error">
                            No Inventory
                        </span>
                    </div>
                )}
            </div>

            {/* Equipment Information */}
            <div className="flex flex-1 flex-col p-5">

                <h3
                    className="mb-3 truncate text-lg font-bold text-base-content"
                    title={equipment.name}
                >
                    {equipment.name}
                </h3>

                <div className="mb-4 flex items-center gap-1 text-sm text-base-content/70">
                    <MapPin size={16} />
                    <span className="truncate">{equipment.location}</span>
                </div>

                <div className="mb-4 flex items-center justify-between border-t border-base-300 pt-4">

                    <div>
                        <p className="text-xl font-bold text-base-content">
                            ${equipment.rentalPrice}
                        </p>

                        <p className="text-xs text-base-content/60">
                            Per {equipment.rentalType.toLowerCase()}
                        </p>
                    </div>

                    {quantity !== undefined && (
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${quantity <= 0
                                    ? "bg-base-200 text-base-content/60"
                                    : "bg-success/15 text-success"
                                }`}
                        >
                            {quantity <= 0
                                ? "No inventory"
                                : `${quantity} total units`}
                        </span>
                    )}

                </div>

                <Link
                    href={`/equipment/${equipment._id}`}
                    className="mt-auto block w-full rounded-lg border border-secondary py-2.5 text-center text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-secondary-content"
                >
                    View Details
                </Link>

            </div>
        </div>
    );
}