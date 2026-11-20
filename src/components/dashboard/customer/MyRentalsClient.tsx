"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Rental {
    _id: string;
    equipmentName: string;
    equipmentImage: string;
    rentalStartDate: string;
    rentalEndDate: string;
    quantity: number;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    bookingStatus: string;
    createdAt: string;
}

const MyRentalsClient = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const token = await getTokenFromClient();

                if (!token) {
                    throw new Error("Please sign in again.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/bookings/my-rentals`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load your rentals.");
                }

                const data = await response.json();
                setRentals(data);

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase()
        }).format(amount);
    };

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Rentals</h1>
                <p className="mt-1 text-base-content/60">
                    View and track all your equipment rentals.
                </p>
            </div>

            {loading ? (
                <div className="py-12 text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-3">Loading your rentals...</p>
                </div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : rentals.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <h2 className="text-lg font-semibold">
                        No Rentals Yet
                    </h2>
                    <p className="mt-2 text-sm text-base-content/60">
                        Your confirmed rentals will appear here.
                    </p>
                    <Link
                        href="/equipment"
                        className="btn btn-primary mt-5"
                    >
                        Explore Equipment
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {rentals.map(rental => (
                        <div
                            key={rental._id}
                            className="flex flex-col gap-5 rounded-xl border border-base-300 bg-base-100 p-5 sm:flex-row"
                        >
                            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-base-200 sm:w-48">
                                {rental.equipmentImage && (
                                    <Image
                                        src={rental.equipmentImage}
                                        alt={rental.equipmentName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 192px"
                                    />
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="text-lg font-semibold">
                                        {rental.equipmentName}
                                    </h2>

                                    <span className="badge badge-success">
                                        {rental.bookingStatus}
                                    </span>
                                </div>

                                <div className="grid gap-3 text-sm sm:grid-cols-2">
                                    <p>
                                        <span className="text-base-content/60">
                                            Rental Period:
                                        </span>
                                        <br />
                                        {formatDate(rental.rentalStartDate)}
                                        {" - "}
                                        {formatDate(rental.rentalEndDate)}
                                    </p>

                                    <p>
                                        <span className="text-base-content/60">
                                            Booking Date:
                                        </span>
                                        <br />
                                        {formatDate(rental.createdAt)}
                                    </p>

                                    <p>
                                        <span className="text-base-content/60">
                                            Quantity:
                                        </span>
                                        <br />
                                        {rental.quantity}
                                    </p>

                                    <p>
                                        <span className="text-base-content/60">
                                            Payment Status:
                                        </span>
                                        <br />
                                        <span className="font-medium text-success">
                                            {rental.paymentStatus}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-between border-t border-base-300 pt-3">
                                    <p className="font-semibold">
                                        Total:{" "}
                                        {formatAmount(
                                            rental.totalAmount,
                                            rental.currency
                                        )}
                                    </p>

                                    <span className="text-xs text-base-content/50">
                                        Booking ID: {rental._id.slice(-8)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyRentalsClient;