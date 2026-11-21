"use client";

import { useEffect, useState } from "react";
import EquipmentCard from "@/components/equipment/EquipmentCard";

type Equipment = {
    _id: string;
    name: string;
    category: string;
    imageUrl: string;
    location: string;
    rentalPrice: number;
    rentalType: "Daily" | "Weekly" | "Monthly";
    availableQuantity: number;
};

const categories = [
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
];

export default function AllEquipmentClient({
    initialCategory,
}: {
    initialCategory: string;
}) {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(
        categories.includes(initialCategory) ? initialCategory : ""
    );
    const [rentalType, setRentalType] = useState("");
    const [availability, setAvailability] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("recently-added");

    useEffect(() => {
        const delay = setTimeout(() => {
            const fetchEquipment = async () => {
                try {
                    setLoading(true);
                    setError(false);

                    const params = new URLSearchParams();

                    if (search) params.append("search", search);
                    if (category) params.append("category", category);
                    if (rentalType) params.append("rentalType", rentalType);
                    if (availability) params.append("availability", availability);
                    if (minPrice) params.append("minPrice", minPrice);
                    if (maxPrice) params.append("maxPrice", maxPrice);

                    params.append("sort", sort);

                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/equipment?${params.toString()}`
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
        }, 400);

        return () => clearTimeout(delay);
    }, [search, category, rentalType, availability, minPrice, maxPrice, sort]);

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setRentalType("");
        setAvailability("");
        setMinPrice("");
        setMaxPrice("");
        setSort("recently-added");
    };

    return (
        <section className="py-12">
            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by equipment name or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            {/* Filters */}
            <div className="mb-8 grid gap-4 rounded-xl border border-base-300 bg-base-100 p-5 sm:grid-cols-2 lg:grid-cols-3">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="">All Categories</option>
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    value={rentalType}
                    onChange={(e) => setRentalType(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="">All Rental Types</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>

                <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="">All Availability</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>

                <input
                    type="number"
                    min="0"
                    placeholder="Minimum price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="input input-bordered w-full"
                />

                <input
                    type="number"
                    min="0"
                    placeholder="Maximum price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input input-bordered w-full"
                />

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="recently-added">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {/* Results heading */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-base-content/70">
                    {loading ? "Loading equipment..." : `${equipment.length} equipment found`}
                </p>

                <button
                    onClick={resetFilters}
                    className="btn btn-ghost btn-sm"
                >
                    Reset Filters
                </button>
            </div>

            {/* Equipment Grid */}
            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="h-96 animate-pulse rounded-2xl bg-base-300"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="py-16 text-center">
                    <p className="mb-4 text-error">
                        Failed to load equipment. Please try again.
                    </p>
                    <button
                        onClick={() => setSearch((current) => current)}
                        className="btn btn-outline btn-sm"
                    >
                        Try Again
                    </button>
                </div>
            ) : equipment.length === 0 ? (
                <div className="rounded-xl bg-base-200 py-16 text-center">
                    <h3 className="mb-2 text-xl font-bold">
                        No equipment found
                    </h3>
                    <p className="mb-4 text-sm text-base-content/60">
                        Try changing your search or filters.
                    </p>
                    <button onClick={resetFilters} className="btn btn-primary btn-sm">
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {equipment.map((item) => (
                        <EquipmentCard key={item._id} equipment={item} />
                    ))}
                </div>
            )}
        </section>
    );
}