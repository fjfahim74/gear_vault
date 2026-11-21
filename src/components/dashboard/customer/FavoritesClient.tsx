"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, HeartOff } from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Equipment {
    _id: string;
    name: string;
    category: string;
    imageUrl: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
}

const FavoritesClient = () => {
    const [favorites, setFavorites] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load favorites.");
            }

            const data = await response.json();
            setFavorites(data);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const handleRemove = async (equipmentId: string) => {
        const confirmed = window.confirm(
            "Remove this equipment from your favorites?"
        );

        if (!confirmed) return;

        const previousFavorites = favorites;

        setFavorites(current =>
            current.filter(item => item._id !== equipmentId)
        );

        try {
            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/favorites/${equipmentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove favorite.");
            }

            toast.success("Removed from favorites!");

        } catch (error) {
            setFavorites(previousFavorites);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price);
    };

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Favorites</h1>
                <p className="mt-1 text-base-content/60">
                    Manage your saved equipment.
                </p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(item => (
                        <div
                            key={item}
                            className="skeleton h-24 w-full rounded-xl"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-error/30 p-8 text-center">
                    <p className="text-error">{error}</p>
                    <button
                        onClick={fetchFavorites}
                        className="btn btn-primary btn-sm mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : favorites.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <Heart
                        size={40}
                        className="mx-auto text-base-content/30"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                        No favorites yet
                    </h2>

                    <p className="mt-2 text-sm text-base-content/60">
                        Tap the heart on any equipment page to save it here.
                    </p>

                    <Link
                        href="/equipment"
                        className="btn btn-primary mt-5"
                    >
                        Browse Equipment
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto rounded-xl border border-base-300 bg-base-100 md:block">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Equipment</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {favorites.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-200">
                                                    {item.imageUrl && (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>

                                                <span className="font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td>{item.category}</td>

                                        <td>
                                            <span className="font-semibold">
                                                {formatPrice(item.rentalPrice)}
                                            </span>
                                            <span className="text-xs text-base-content/60">
                                                {" "}/ {item.rentalType}
                                            </span>
                                        </td>

                                        <td>
                                            {item.availableQuantity > 0 ? (
                                                <span className="badge badge-success">
                                                    {item.availableQuantity} total units
                                                </span>
                                            ) : (
                                                <span className="badge badge-error">
                                                    No inventory
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/equipment/${item._id}`}
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </Link>

                                                <button
                                                    onClick={() => handleRemove(item._id)}
                                                    className="btn btn-ghost btn-sm text-error"
                                                >
                                                    <HeartOff size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 md:hidden">
                        {favorites.map(item => (
                            <div
                                key={item._id}
                                className="rounded-xl border border-base-300 bg-base-100 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-base-200">
                                        {item.imageUrl && (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">
                                            {item.name}
                                        </h2>
                                        <p className="text-sm text-base-content/60">
                                            {item.category}
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {formatPrice(item.rentalPrice)}
                                            {" / "}
                                            {item.rentalType}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    {item.availableQuantity > 0 ? (
                                        <span className="badge badge-success">
                                            {item.availableQuantity} total units
                                        </span>
                                    ) : (
                                        <span className="badge badge-error">
                                            No inventory
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <Link
                                        href={`/equipment/${item._id}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="btn btn-ghost btn-sm text-error"
                                    >
                                        <HeartOff size={16} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default FavoritesClient;