"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    HardHat,
    Camera,
    Truck,
    Tractor,
    Cpu,
    Speaker,
    ArrowUpRight,
} from "lucide-react";

const categories = [
    {
        name: "Construction Equipment",
        slug: "construction-equipment",
        icon: HardHat,
        image:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=85",
    },
    {
        name: "Photography Equipment",
        slug: "photography-equipment",
        icon: Camera,
        image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85",
    },
    {
        name: "Vehicles & Transportation",
        slug: "vehicles-transportation",
        icon: Truck,
        image:
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=85",
    },
    {
        name: "Agriculture Equipment",
        slug: "agriculture-equipment",
        icon: Tractor,
        image:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85",
    },
    {
        name: "Electronics",
        slug: "electronics",
        icon: Cpu,
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
    },
    {
        name: "Event Equipment",
        slug: "event-equipment",
        icon: Speaker,
        image:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=85",
    },
];

export default function Categories() {
    return (
        <section className="bg-base-100 py-20">
            <div className="mx-auto max-w-7xl px-5">
                <div className="mb-10">
                    <p className="mb-2 font-semibold text-accent">
                        BROWSE BY CATEGORY
                    </p>

                    <h2 className="text-3xl font-bold text-base-content md:text-4xl">
                        Find Equipment for Every Job
                    </h2>

                    <p className="mt-3 text-base-content/70">
                        Explore equipment across different categories for your next project.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;

                        return (
                            <motion.div
                                key={category.slug}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <Link
                                    href={`/equipment?category=${encodeURIComponent(category.name)}`}
                                    className="group relative block aspect-square overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary sm:aspect-[4/3]"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${category.image})` }}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B46] via-[#0F2B46]/30 to-transparent transition group-hover:from-[#0F2B46]/95" />

                                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                                            <Icon size={21} />
                                        </div>

                                        <h3 className="text-base font-bold text-white sm:text-lg">
                                            {category.name}
                                        </h3>
                                    </div>

                                    <div className="absolute right-4 top-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-base-100 text-secondary opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                        <ArrowUpRight size={19} />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}