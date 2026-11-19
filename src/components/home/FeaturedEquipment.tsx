"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EquipmentCard from "@/components/equipment/EquipmentCard";

type Equipment = {
    _id: string;
    name: string;
    category: string;
    imageUrl: string;
    location: string;
    rentalPrice: number;
    rentalType: "Daily" | "Weekly" | "Monthly";
};

export default function FeaturedEquipment() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/equipment/featured`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch equipment");
                }

                const data = await response.json();
                setEquipment(data);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    return (
        <section className="bg-base-200 py-20">
            <div className="mx-auto max-w-7xl px-5">
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 font-semibold text-accent">
                            EXPLORE OUR MARKETPLACE
                        </p>

                        <h2 className="text-3xl font-bold text-base-content md:text-4xl">
                            Featured Equipment
                        </h2>

                        <p className="mt-3 text-base-content/70">
                            Discover quality equipment ready for your next project.
                        </p>
                    </div>

                    <Link
                        href="/equipment"
                        className="font-semibold text-secondary transition-colors hover:text-accent"
                    >
                        View All Equipment →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="h-80 animate-pulse rounded-2xl bg-base-300"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <p className="py-10 text-center text-error">
                        Failed to load equipment. Please try again later.
                    </p>
                ) : equipment.length === 0 ? (
                    <p className="py-10 text-center text-base-content/70">
                        No equipment available yet. Be the first to list equipment!
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {equipment.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <EquipmentCard equipment={item} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}