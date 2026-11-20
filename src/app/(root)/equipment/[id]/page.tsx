import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EquipmentDetailsClient from "@/components/equipment/EquipmentDetailsClient";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EquipmentDetailsPage({ params }: Props) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const { id } = await params;

    return <EquipmentDetailsClient equipmentId={id} />;
}