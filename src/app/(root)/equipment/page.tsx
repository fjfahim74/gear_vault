import Link from "next/link";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import AllEquipmentClient from "@/components/equipment/AllEquipmentClient";

type Props = {
    searchParams: Promise<{
        category?: string;
    }>;
};

export default async function AllEquipmentPage({ searchParams }: Props) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-base-100">

            {/* Page Header */}
            <div className="bg-base-200 py-10">
                <Container>
                    <div className="mb-4 text-sm text-base-content/60">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        {" / "}
                        <span className="text-base-content">
                            All Equipment
                        </span>
                    </div>

                    <PageHeader
                        title="All Equipment"
                        subtitle="Explore quality equipment for your next project. Find the right gear at the right price."
                    />
                </Container>
            </div>

            {/* Marketplace Content */}
            <Container>
                <AllEquipmentClient initialCategory={params.category ?? ""} />
            </Container>

        </div>
    );
}