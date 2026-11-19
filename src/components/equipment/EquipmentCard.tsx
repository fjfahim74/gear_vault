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
};

type EquipmentCardProps = {
    equipment: Equipment;
};

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-52 w-full">
                {equipment.imageUrl ? (
                    <img
                        src={equipment.imageUrl}
                        alt={equipment.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-sm text-base-content/50">
                        No image available
                    </div>
                )}
            </div>

            <div className="p-5">
                <p className="mb-2 text-sm font-medium text-accent">
                    {equipment.category}
                </p>

                <h3 className="mb-3 text-lg font-bold text-base-content">
                    {equipment.name}
                </h3>

                <div className="mb-4 flex items-center gap-1 text-sm text-base-content/70">
                    <MapPin size={16} />
                    {equipment.location}
                </div>

                <div className="flex items-center justify-between border-t border-base-300 pt-4">
                    <div>
                        <p className="text-xl font-bold text-base-content">
                            ${equipment.rentalPrice}
                        </p>

                        <p className="text-xs text-base-content/60">
                            Per {equipment.rentalType.toLowerCase()}
                        </p>
                    </div>

                    <Link
                        href={`/equipment/${equipment._id}`}
                        className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-content transition hover:bg-secondary/90"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}