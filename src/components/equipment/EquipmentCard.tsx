import Image from "next/image";
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-52 w-full">
                <Image
                    src={equipment.imageUrl}
                    alt={equipment.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-5">
                <p className="mb-2 text-sm font-medium text-teal-700">
                    {equipment.category}
                </p>

                <h3 className="mb-3 text-lg font-bold text-[#0F2B46]">
                    {equipment.name}
                </h3>

                <div className="mb-4 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin size={16} />
                    {equipment.location}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-xl font-bold text-[#0F2B46]">
                            ${equipment.rentalPrice}
                        </p>
                        <p className="text-xs text-slate-500">
                            Per {equipment.rentalType.toLowerCase()}
                        </p>
                    </div>

                    <Link
                        href={`/equipment/${equipment._id}`}
                        className="rounded-lg bg-[#0F2B46] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#17466f]"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}