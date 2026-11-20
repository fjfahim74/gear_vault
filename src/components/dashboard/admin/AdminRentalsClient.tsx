"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Receipt,
    RefreshCw
} from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Rental {
    _id: string;
    customerName: string;
    customerEmail: string;
    ownerName: string;
    ownerEmail: string;
    equipmentName: string;
    rentalStartDate: string;
    rentalEndDate: string;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    bookingStatus: string;
}

const AdminRentalsClient = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [bookingFilter, setBookingFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");

    const [selectedRental, setSelectedRental] =
        useState<Rental | null>(null);

    const [nextStatus, setNextStatus] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all rentals
    const fetchRentals = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load rentals.");
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

    useEffect(() => {
        fetchRentals();
    }, []);

    // Search and filters
    const filteredRentals = rentals.filter(item => {
        const searchMatch =
            item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            item.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
            item.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
            item.equipmentName?.toLowerCase().includes(search.toLowerCase());

        const bookingMatch =
            bookingFilter === "All" ||
            item.bookingStatus === bookingFilter;

        const paymentMatch =
            paymentFilter === "All" ||
            item.paymentStatus === paymentFilter;

        return searchMatch && bookingMatch && paymentMatch;
    });

    // Status badge
    const getStatusBadge = (status: string) => {
        if (["Paid", "Completed"].includes(status)) {
            return "badge-success";
        }

        if (["Confirmed"].includes(status)) {
            return "badge-info";
        }

        if (["Cancelled", "Failed"].includes(status)) {
            return "badge-error";
        }

        return "badge-warning";
    };

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // Format amount
    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: (currency || "usd").toUpperCase()
        }).format(amount);
    };

    // Update booking status
    const handleStatusUpdate = async () => {
        if (!selectedRental || !nextStatus) return;

        try {
            setActionLoading(true);

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/${selectedRental._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bookingStatus: nextStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update rental.");
            }

            setRentals(prev =>
                prev.map(item =>
                    item._id === selectedRental._id
                        ? { ...item, bookingStatus: nextStatus }
                        : item
                )
            );

            toast.success("Booking status updated.");

            setSelectedRental(null);
            setNextStatus("");

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <section className="space-y-6">

            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">
                        All Rentals
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Monitor and manage all rental bookings.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                    <Receipt size={20} className="text-primary" />

                    <div>
                        <p className="text-xs text-base-content/50">
                            Total Rentals
                        </p>
                        <p className="font-bold">{rentals.length}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3 rounded-xl border border-base-300 bg-base-100 p-4">

                <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="input input-bordered flex flex-1 items-center gap-2">
                        <Search size={18} className="text-base-content/50" />

                        <input
                            type="text"
                            placeholder="Search customer, owner or equipment..."
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                        />
                    </label>

                    <button
                        onClick={fetchRentals}
                        className="btn btn-outline"
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <select
                        className="select select-bordered select-sm"
                        value={bookingFilter}
                        onChange={event => setBookingFilter(event.target.value)}
                    >
                        <option value="All">All Booking Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <select
                        className="select select-bordered select-sm"
                        value={paymentFilter}
                        onChange={event => setPaymentFilter(event.target.value)}
                    >
                        <option value="All">All Payment Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Rentals Table */}
            {loading ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                    <p className="mt-3 text-sm text-base-content/60">
                        Loading rentals...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-error/30 bg-base-100 p-8 text-center">
                    <p className="text-error">{error}</p>

                    <button
                        onClick={fetchRentals}
                        className="btn btn-primary btn-sm mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredRentals.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <Receipt
                        size={40}
                        className="mx-auto text-base-content/30"
                    />

                    <h2 className="mt-3 font-semibold">
                        No rentals found
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                    <table className="table min-w-[1100px]">
                        <thead>
                            <tr className="bg-base-200/60 text-base-content/70">
                                <th>Customer</th>
                                <th>Owner</th>
                                <th>Equipment</th>
                                <th>Rental Duration</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Booking</th>
                                <th>Manage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRentals.map(item => (
                                <tr key={item._id}>
                                    <td>
                                        <p className="font-medium">
                                            {item.customerName}
                                        </p>
                                        <p className="text-xs text-base-content/60">
                                            {item.customerEmail}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="font-medium">
                                            {item.ownerName}
                                        </p>
                                        <p className="text-xs text-base-content/60">
                                            {item.ownerEmail}
                                        </p>
                                    </td>

                                    <td className="font-medium">
                                        {item.equipmentName}
                                    </td>

                                    <td className="whitespace-nowrap text-sm">
                                        {formatDate(item.rentalStartDate)}
                                        {" - "}
                                        {formatDate(item.rentalEndDate)}
                                    </td>

                                    <td className="whitespace-nowrap font-semibold">
                                        {formatAmount(item.totalAmount, item.currency)}
                                    </td>

                                    <td>
                                        <span className={`badge ${getStatusBadge(item.paymentStatus)}`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`badge ${getStatusBadge(item.bookingStatus)}`}>
                                            {item.bookingStatus}
                                        </span>
                                    </td>

                                    <td>
                                        <select
                                            className="select select-bordered select-xs"
                                            value={item.bookingStatus}
                                            onChange={event => {
                                                setSelectedRental(item);
                                                setNextStatus(event.target.value);
                                            }}
                                        >
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirmation Dialog */}
            {selectedRental && nextStatus && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">
                            Update Booking Status?
                        </h3>

                        <p className="mt-3 text-sm text-base-content/70">
                            Change the booking status for{" "}
                            <strong>{selectedRental.equipmentName}</strong>{" "}
                            to <strong>{nextStatus}</strong>?
                        </p>

                        {nextStatus === "Cancelled" && (
                            <p className="mt-3 rounded-lg bg-warning/10 p-3 text-xs">
                                This changes the booking status only. It does not issue a Stripe refund.
                            </p>
                        )}

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                disabled={actionLoading}
                                onClick={() => {
                                    setSelectedRental(null);
                                    setNextStatus("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                disabled={actionLoading}
                                onClick={handleStatusUpdate}
                            >
                                {actionLoading
                                    ? "Updating..."
                                    : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminRentalsClient;