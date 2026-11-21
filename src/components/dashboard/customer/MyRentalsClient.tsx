"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Rental {
    _id: string;
    equipmentId: string;
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

    const fetchRentals = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

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
    }, []);

    useEffect(() => {
        fetchRentals();
    }, [fetchRentals]);

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

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
            case "confirmed":
            case "completed":
                return "text-success";

            case "pending":
                return "text-warning";

            case "cancelled":
            case "failed":
                return "text-error";

            default:
                return "text-base-content/70";
        }
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
                <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                {[
                                    "Equipment",
                                    "Start Date",
                                    "End Date",
                                    "Booking Date",
                                    "Total Amount",
                                    "Payment Status",
                                    "Booking Status"
                                ].map((heading) => (
                                    <th key={heading}>{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index}>
                                    {Array.from({ length: 7 }).map((_, cell) => (
                                        <td key={cell}>
                                            <div className="skeleton h-5 w-20"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-error/30 bg-base-100 p-8 text-center">
                    <p className="text-error">{error}</p>
                    <button
                        onClick={fetchRentals}
                        className="btn btn-primary mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : rentals.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <h2 className="text-lg font-semibold">
                        You haven't rented anything yet
                    </h2>
                    <p className="mt-2 text-sm text-base-content/60">
                        Explore equipment and make your first rental.
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
                                    <th>Equipment Name</th>
                                    <th>Rental Start Date</th>
                                    <th>Rental End Date</th>
                                    <th>Booking Date</th>
                                    <th>Total Amount</th>
                                    <th>Payment Status</th>
                                    <th>Booking Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rentals.map((rental) => (
                                    <tr key={rental._id}>
                                        <td>
                                            <Link
                                                href={`/equipment/${rental.equipmentId}`}
                                                className="flex items-center gap-3 font-medium hover:text-primary"
                                            >
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-200">
                                                    {rental.equipmentImage && (
                                                        <Image
                                                            src={rental.equipmentImage}
                                                            alt={rental.equipmentName}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <span className="min-w-32">
                                                    {rental.equipmentName}
                                                </span>
                                            </Link>
                                        </td>

                                        <td>{formatDate(rental.rentalStartDate)}</td>
                                        <td>{formatDate(rental.rentalEndDate)}</td>
                                        <td>{formatDate(rental.createdAt)}</td>

                                        <td className="font-semibold">
                                            {formatAmount(
                                                rental.totalAmount,
                                                rental.currency
                                            )}
                                        </td>

                                        <td>
                                            <span className={`text-sm font-medium ${getStatusStyle(rental.paymentStatus)}`}>
                                                {rental.paymentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`text-sm font-medium ${getStatusStyle(rental.bookingStatus)}`}>
                                                {rental.bookingStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 md:hidden">
                        {rentals.map((rental) => (
                            <div
                                key={rental._id}
                                className="rounded-xl border border-base-300 bg-base-100 p-4"
                            >
                                <Link
                                    href={`/equipment/${rental.equipmentId}`}
                                    className="flex items-center gap-3"
                                >
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-base-200">
                                        {rental.equipmentImage && (
                                            <Image
                                                src={rental.equipmentImage}
                                                alt={rental.equipmentName}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    <h2 className="font-semibold hover:text-primary">
                                        {rental.equipmentName}
                                    </h2>
                                </Link>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-base-content/60">Start Date</p>
                                        <p>{formatDate(rental.rentalStartDate)}</p>
                                    </div>

                                    <div>
                                        <p className="text-base-content/60">End Date</p>
                                        <p>{formatDate(rental.rentalEndDate)}</p>
                                    </div>

                                    <div>
                                        <p className="text-base-content/60">Booking Date</p>
                                        <p>{formatDate(rental.createdAt)}</p>
                                    </div>

                                    <div>
                                        <p className="text-base-content/60">Total Amount</p>
                                        <p className="font-semibold">
                                            {formatAmount(
                                                rental.totalAmount,
                                                rental.currency
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-base-300 pt-3">
                                    <span className="text-sm font-medium">
                                        Payment: <span className={getStatusStyle(rental.paymentStatus)}>
                                            {rental.paymentStatus}
                                        </span>
                                    </span>

                                    <span className={`text-sm font-medium ${getStatusStyle(rental.bookingStatus)}`}>
                                        {rental.bookingStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default MyRentalsClient;