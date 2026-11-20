"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Receipt, CalendarDays, X } from "lucide-react";
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
    quantity: number;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    bookingStatus: string;
    createdAt: string;
}

const AdminRentalsClient = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
    const [nextStatus, setNextStatus] = useState<"Completed" | "Cancelled" | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all rentals
    const fetchRentals = useCallback(async () => {
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load rentals.");
            }

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

    // Search and filter
    const filteredRentals = useMemo(() => {
        return rentals.filter(rental => {
            const term = search.toLowerCase();

            const matchesSearch =
                rental.customerName?.toLowerCase().includes(term) ||
                rental.customerEmail?.toLowerCase().includes(term) ||
                rental.ownerName?.toLowerCase().includes(term) ||
                rental.ownerEmail?.toLowerCase().includes(term) ||
                rental.equipmentName?.toLowerCase().includes(term);

            return matchesSearch &&
                (statusFilter === "All" || rental.bookingStatus === statusFilter);
        });
    }, [rentals, search, statusFilter]);

    // Format date
    const formatDate = (value: string) => {
        return new Date(value).toLocaleDateString("en-US", {
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

    // Status badge
    const badgeClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case "paid":
            case "completed":
                return "badge-success";

            case "confirmed":
                return "badge-info";

            case "pending":
                return "badge-warning";

            case "cancelled":
            case "failed":
                return "badge-error";

            default:
                return "badge-ghost";
        }
    };

    // Update rental status
    const updateStatus = async () => {
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
                throw new Error(data.message || "Could not update rental.");
            }

            setRentals(prev =>
                prev.map(item =>
                    item._id === selectedRental._id
                        ? { ...item, bookingStatus: nextStatus }
                        : item
                )
            );

            toast.success(data.message || "Rental status updated.");

            setSelectedRental(null);
            setNextStatus(null);

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

    // Open confirmation dialog
    const openStatusDialog = (
        rental: Rental,
        status: "Completed" | "Cancelled"
    ) => {
        setSelectedRental(rental);
        setNextStatus(status);
    };

    const statusTabs = ["All", "Confirmed", "Completed", "Cancelled"];

    return (
        <section className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Marketplace control
                    </p>

                    <h1 className="mt-1 text-2xl font-bold">
                        All Rentals
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Monitor every rental booking and its payment status.
                    </p>
                </div>

                <button
                    onClick={fetchRentals}
                    className="btn btn-outline btn-sm"
                    disabled={loading}
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    {
                        label: "Total rentals",
                        value: rentals.length
                    },
                    {
                        label: "Confirmed",
                        value: rentals.filter(
                            item => item.bookingStatus === "Confirmed"
                        ).length
                    },
                    {
                        label: "Completed",
                        value: rentals.filter(
                            item => item.bookingStatus === "Completed"
                        ).length
                    }
                ].map(stat => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-base-300 bg-base-100 p-4"
                    >
                        <p className="text-sm text-base-content/60">
                            {stat.label}
                        </p>

                        <p className="mt-1 text-2xl font-bold tabular-nums">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5">

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                    />

                    <input
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Search customer, owner, or equipment..."
                        className="input input-bordered w-full pl-10"
                    />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {statusTabs.map(status => {
                        const count = status === "All"
                            ? rentals.length
                            : rentals.filter(
                                item => item.bookingStatus === status
                            ).length;

                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`btn btn-sm ${statusFilter === status
                                        ? "btn-primary"
                                        : "btn-ghost border border-base-300"
                                    }`}
                            >
                                {status}
                                <span className="ml-1 opacity-70">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Rental Records */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="skeleton h-20 w-full rounded-xl"
                        />
                    ))}
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
                <div className="rounded-xl border border-base-300 bg-base-100 px-5 py-14 text-center">
                    <Receipt
                        size={34}
                        className="mx-auto text-base-content/30"
                    />

                    <h2 className="mt-3 font-semibold">
                        {rentals.length
                            ? "No matching rentals"
                            : "No rental records yet"}
                    </h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        {rentals.length
                            ? "Try another search or status filter."
                            : "Confirmed bookings will appear here."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto rounded-xl border border-base-300 bg-base-100 xl:block">
                        <table className="table">
                            <thead>
                                <tr>
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
                                {filteredRentals.map(rental => (
                                    <tr key={rental._id}>
                                        <td>
                                            <p className="font-semibold">
                                                {rental.customerName}
                                            </p>
                                            <p className="text-xs text-base-content/60">
                                                {rental.customerEmail}
                                            </p>
                                        </td>

                                        <td>
                                            <p className="font-medium">
                                                {rental.ownerName}
                                            </p>
                                            <p className="text-xs text-base-content/60">
                                                {rental.ownerEmail}
                                            </p>
                                        </td>

                                        <td className="font-medium">
                                            {rental.equipmentName}
                                        </td>

                                        <td className="whitespace-nowrap text-sm">
                                            {formatDate(rental.rentalStartDate)}
                                            {" – "}
                                            {formatDate(rental.rentalEndDate)}
                                        </td>

                                        <td className="whitespace-nowrap font-semibold tabular-nums">
                                            {formatAmount(rental.totalAmount, rental.currency)}
                                        </td>

                                        <td>
                                            <span className={`badge ${badgeClass(rental.paymentStatus)}`}>
                                                {rental.paymentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`badge ${badgeClass(rental.bookingStatus)}`}>
                                                {rental.bookingStatus}
                                            </span>
                                        </td>

                                        <td>
                                            {rental.bookingStatus === "Confirmed" ? (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => openStatusDialog(rental, "Completed")}
                                                        className="btn btn-success btn-xs"
                                                    >
                                                        Complete
                                                    </button>

                                                    <button
                                                        onClick={() => openStatusDialog(rental, "Cancelled")}
                                                        className="btn btn-error btn-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-base-content/50">
                                                    No actions
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="grid gap-3 xl:hidden">
                        {filteredRentals.map(rental => (
                            <article
                                key={rental._id}
                                className="rounded-xl border border-base-300 bg-base-100 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold">
                                            {rental.equipmentName}
                                        </h2>

                                        <p className="mt-1 text-xs text-base-content/60">
                                            {formatDate(rental.rentalStartDate)}
                                            {" – "}
                                            {formatDate(rental.rentalEndDate)}
                                        </p>
                                    </div>

                                    <span className={`badge ${badgeClass(rental.bookingStatus)}`}>
                                        {rental.bookingStatus}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-base-content/50">
                                            Customer
                                        </p>
                                        <p className="font-medium">
                                            {rental.customerName}
                                        </p>
                                        <p className="break-all text-xs text-base-content/60">
                                            {rental.customerEmail}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-base-content/50">
                                            Owner
                                        </p>
                                        <p className="font-medium">
                                            {rental.ownerName}
                                        </p>
                                        <p className="break-all text-xs text-base-content/60">
                                            {rental.ownerEmail}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-base-content/50">
                                            Booking amount
                                        </p>
                                        <p className="font-semibold">
                                            {formatAmount(rental.totalAmount, rental.currency)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-base-content/50">
                                            Payment
                                        </p>
                                        <span className={`badge ${badgeClass(rental.paymentStatus)}`}>
                                            {rental.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {rental.bookingStatus === "Confirmed" && (
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => openStatusDialog(rental, "Completed")}
                                            className="btn btn-success btn-sm flex-1"
                                        >
                                            Mark Completed
                                        </button>

                                        <button
                                            onClick={() => openStatusDialog(rental, "Cancelled")}
                                            className="btn btn-error btn-sm flex-1"
                                        >
                                            Cancel Rental
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </>
            )}

            {/* Confirmation Dialog */}
            {selectedRental && nextStatus && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">

                        <button
                            onClick={() => {
                                setSelectedRental(null);
                                setNextStatus(null);
                            }}
                            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                            disabled={actionLoading}
                        >
                            <X size={18} />
                        </button>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning/15 text-warning">
                            <CalendarDays size={22} />
                        </div>

                        <h3 className="mt-4 text-lg font-bold">
                            {nextStatus === "Completed"
                                ? "Complete this rental?"
                                : "Cancel this rental?"}
                        </h3>

                        <p className="mt-2 text-sm text-base-content/70">
                            Update <strong>{selectedRental.equipmentName}</strong>
                            {" "}for {selectedRental.customerName} to{" "}
                            <strong>{nextStatus}</strong>?
                        </p>

                        {nextStatus === "Cancelled" && (
                            <p className="mt-3 rounded-lg bg-warning/10 p-3 text-xs text-warning-content">
                                This only changes the booking status. It does not issue a Stripe refund or change the payment record.
                            </p>
                        )}

                        <div className="modal-action">
                            <button
                                onClick={() => {
                                    setSelectedRental(null);
                                    setNextStatus(null);
                                }}
                                className="btn btn-ghost"
                                disabled={actionLoading}
                            >
                                Keep Booking
                            </button>

                            <button
                                onClick={updateStatus}
                                className={`btn ${nextStatus === "Cancelled"
                                        ? "btn-error"
                                        : "btn-primary"
                                    }`}
                                disabled={actionLoading}
                            >
                                {actionLoading
                                    ? <span className="loading loading-spinner loading-sm" />
                                    : `Confirm ${nextStatus}`}
                            </button>
                        </div>
                    </div>

                    <button
                        className="modal-backdrop"
                        onClick={() => {
                            if (!actionLoading) {
                                setSelectedRental(null);
                                setNextStatus(null);
                            }
                        }}
                    >
                        close
                    </button>
                </div>
            )}
        </section>
    );
};

export default AdminRentalsClient;