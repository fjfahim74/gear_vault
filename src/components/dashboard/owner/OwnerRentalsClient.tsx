"use client";

import { useCallback, useEffect, useState } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Rental {
    _id: string;
    customerName: string;
    customerEmail: string;
    equipmentName: string;
    rentalStartDate: string;
    rentalEndDate: string;
    quantity: number;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    bookingStatus: string;
}

const OwnerRentalsClient = () => {
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
                `${process.env.NEXT_PUBLIC_API_URL}/bookings/owner-rentals`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load rental records.");
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

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    const formatAmount = (amount: number, currency: string) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase()
        }).format(amount);

    const statusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
            case "confirmed":
            case "completed":
                return "badge-success";
            case "pending":
                return "badge-warning";
            case "cancelled":
            case "failed":
                return "badge-error";
            default:
                return "badge-ghost";
        }
    };

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Equipment Rentals</h1>
                <p className="mt-1 text-base-content/60">
                    Manage rental bookings for your equipment.
                </p>
            </div>

            {loading ? (
                <div className="py-12 text-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                    <p className="mt-3">Loading rental records...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-error/30 p-8 text-center">
                    <p className="text-error">{error}</p>
                    <button
                        onClick={fetchRentals}
                        className="btn btn-primary btn-sm mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : rentals.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-12 text-center">
                    <h2 className="font-semibold">No rental records yet.</h2>
                    <p className="mt-2 text-sm text-base-content/60">
                        Rental records will appear here when customers book your equipment.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Equipment</th>
                                <th>Rental Duration</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Payment Status</th>
                                <th>Booking Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rentals.map(rental => (
                                <tr key={rental._id}>
                                    <td>
                                        <p className="font-medium">
                                            {rental.customerName}
                                        </p>
                                        <p className="text-xs text-base-content/60">
                                            {rental.customerEmail}
                                        </p>
                                    </td>

                                    <td className="font-medium">
                                        {rental.equipmentName}
                                    </td>

                                    <td className="whitespace-nowrap">
                                        {formatDate(rental.rentalStartDate)}
                                        {" - "}
                                        {formatDate(rental.rentalEndDate)}
                                    </td>

                                    <td>{rental.quantity}</td>

                                    <td className="font-semibold">
                                        {formatAmount(
                                            rental.totalAmount,
                                            rental.currency
                                        )}
                                    </td>

                                    <td>
                                        <span className={`badge ${statusClass(rental.paymentStatus)}`}>
                                            {rental.paymentStatus}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`badge ${statusClass(rental.bookingStatus)}`}>
                                            {rental.bookingStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default OwnerRentalsClient;