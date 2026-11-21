"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Package,
    RefreshCw,
    Check,
    X,
    Pencil,
    Trash2
} from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Equipment {
    _id: string;
    name: string;
    imageUrl: string;
    ownerName?: string;
    ownerEmail: string;
    category: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    status: "Pending" | "Approved" | "Rejected";
    rejectionReason?: string;
}

type ActionType = "Approve" | "Reject" | "Delete";

const AdminEquipmentClient = () => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedEquipment, setSelectedEquipment] =
        useState<Equipment | null>(null);

    const [dialogAction, setDialogAction] =
        useState<ActionType | null>(null);

    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load equipment.");
            }

            const data = await response.json();
            setEquipment(data);

            // Show Pending first when pending equipment exists.
            if (data.some((item: Equipment) => item.status === "Pending")) {
                setStatusFilter("Pending");
            }
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
        fetchEquipment();
    }, []);

    const filteredEquipment = equipment.filter(item => {
        const searchMatch =
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
            item.ownerEmail?.toLowerCase().includes(search.toLowerCase());

        const statusMatch =
            statusFilter === "All" || item.status === statusFilter;

        return searchMatch && statusMatch;
    });

    const getStatusStyle = (status: Equipment["status"]) => {
        if (status === "Approved") return "text-success";
        if (status === "Rejected") return "text-error";
        return "text-warning";
    };

    const getStatusCount = (status: string) => {
        if (status === "All") return equipment.length;

        return equipment.filter(item => item.status === status).length;
    };

    const openDialog = (item: Equipment, action: ActionType) => {
        setSelectedEquipment(item);
        setDialogAction(action);
        setRejectionReason("");
    };

    const closeDialog = () => {
        if (actionLoading) return;

        setSelectedEquipment(null);
        setDialogAction(null);
        setRejectionReason("");
    };

    const handleStatusUpdate = async (status: "Approved" | "Rejected") => {
        if (!selectedEquipment) return;

        try {
            setActionLoading(true);

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/admin/${selectedEquipment._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status,
                        rejectionReason:
                            status === "Rejected" ? rejectionReason : ""
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update status.");
            }

            setEquipment(prev =>
                prev.map(item =>
                    item._id === selectedEquipment._id
                        ? {
                            ...item,
                            status,
                            rejectionReason:
                                status === "Rejected"
                                    ? rejectionReason
                                    : undefined
                        }
                        : item
                )
            );

            toast.success(
                status === "Approved"
                    ? "Equipment approved successfully."
                    : "Equipment rejected successfully."
            );

            closeDialog();
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

    const handleDelete = async () => {
        if (!selectedEquipment) return;

        try {
            setActionLoading(true);

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/admin/${selectedEquipment._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete equipment.");
            }

            setEquipment(prev =>
                prev.filter(item => item._id !== selectedEquipment._id)
            );

            toast.success("Equipment deleted successfully.");
            closeDialog();
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

    const handleConfirmAction = () => {
        if (dialogAction === "Approve") {
            handleStatusUpdate("Approved");
        } else if (dialogAction === "Reject") {
            handleStatusUpdate("Rejected");
        } else if (dialogAction === "Delete") {
            handleDelete();
        }
    };

    const formatPrice = (price: number) => {
        return `$${price} /`;
    };

    const renderActions = (item: Equipment) => (
        <div className="flex items-center gap-1">
            {item.status !== "Approved" && (
                <button
                    onClick={() => openDialog(item, "Approve")}
                    className="btn btn-sm btn-ghost text-success"
                    title="Approve equipment"
                    aria-label="Approve equipment"
                >
                    <Check size={17} />
                </button>
            )}

            {item.status !== "Rejected" && (
                <button
                    onClick={() => openDialog(item, "Reject")}
                    className="btn btn-sm btn-ghost text-error"
                    title="Reject equipment"
                    aria-label="Reject equipment"
                >
                    <X size={17} />
                </button>
            )}

            <Link
                href={`/dashboard/admin/equipment/${item._id}/edit`}
                className="btn btn-sm btn-ghost text-primary"
                title="Update equipment"
                aria-label="Update equipment"
            >
                <Pencil size={16} />
            </Link>

            <button
                onClick={() => openDialog(item, "Delete")}
                className="btn btn-sm btn-ghost text-error"
                title="Delete equipment"
                aria-label="Delete equipment"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );

    return (
        <section className="space-y-6">

            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">
                        All Equipment
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Review and manage equipment listings across GearVault.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                    <Package className="text-primary" size={20} />

                    <div>
                        <p className="text-xs text-base-content/50">
                            Total Equipment
                        </p>
                        <p className="font-bold">{equipment.length}</p>
                    </div>
                </div>
            </div>

            {/* Search and Refresh */}
            <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-4 sm:flex-row">
                <label className="input input-bordered flex flex-1 items-center gap-2">
                    <Search size={18} className="text-base-content/50" />

                    <input
                        type="text"
                        placeholder="Search equipment or owner..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </label>

                <button
                    onClick={fetchEquipment}
                    className="btn btn-outline"
                    disabled={loading}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
                {["All", "Pending", "Approved", "Rejected"].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`btn btn-sm ${statusFilter === status
                            ? "btn-primary"
                            : "btn-outline"
                            }`}
                    >
                        {status}
                        <span className="text-xs font-medium opacity-70">
                            {getStatusCount(status)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Equipment Table */}
            {loading ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-3 text-sm text-base-content/60">
                        Loading equipment...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-error/30 bg-base-100 p-8 text-center">
                    <p className="text-error">{error}</p>

                    <button
                        onClick={fetchEquipment}
                        className="btn btn-primary btn-sm mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredEquipment.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <Package
                        size={40}
                        className="mx-auto text-base-content/30"
                    />

                    <h2 className="mt-3 font-semibold">
                        No equipment found
                    </h2>

                    <p className="mt-1 text-sm text-base-content/50">
                        There are no equipment listings in this status.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto rounded-xl border border-base-300 bg-base-100 md:block">
                        <table className="table">
                            <thead>
                                <tr className="bg-base-200/60 text-base-content/70">
                                    <th>Equipment</th>
                                    <th>Owner</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEquipment.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="h-12 w-12 rounded-lg bg-base-200 object-cover"
                                                />

                                                <div>
                                                    <p className="font-semibold">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <p className="font-medium">
                                                {item.ownerName || "Equipment Owner"}
                                            </p>

                                            <p className="text-xs text-base-content/60">
                                                {item.ownerEmail}
                                            </p>
                                        </td>

                                        <td className="text-sm">
                                            {item.category}
                                        </td>

                                        <td className="text-sm">
                                            {formatPrice(item.rentalPrice)}{" "}
                                            {item.rentalType?.toLowerCase()}
                                        </td>

                                        <td>{item.availableQuantity}</td>

                                        <td>
                                            <span className={`text-sm font-medium ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex justify-end">
                                                {renderActions(item)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-3 md:hidden">
                        {filteredEquipment.map(item => (
                            <div
                                key={item._id}
                                className="rounded-xl border border-base-300 bg-base-100 p-4"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-16 w-16 shrink-0 rounded-lg bg-base-200 object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-base-content/60">
                                            {item.category}
                                        </p>

                                        <span className={`mt-2 block text-sm font-medium ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1 text-sm">
                                    <p>
                                        <span className="text-base-content/50">
                                            Owner:
                                        </span>{" "}
                                        {item.ownerName || "Equipment Owner"}
                                    </p>

                                    <p className="break-all text-xs text-base-content/60">
                                        {item.ownerEmail}
                                    </p>

                                    <p>
                                        {formatPrice(item.rentalPrice)}{" "}
                                        {item.rentalType?.toLowerCase()}
                                        {" · "}
                                        Qty: {item.availableQuantity}
                                    </p>
                                </div>

                                <div className="mt-3 flex justify-end border-t border-base-300 pt-2">
                                    {renderActions(item)}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Action Confirmation Modal */}
            {selectedEquipment && dialogAction && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="text-lg font-bold">
                            {dialogAction === "Approve"
                                ? "Approve Equipment"
                                : dialogAction === "Reject"
                                    ? "Reject Equipment"
                                    : "Delete Equipment"}
                        </h3>

                        <p className="mt-2 text-sm text-base-content/60">
                            {selectedEquipment.name}
                        </p>

                        {dialogAction === "Approve" && (
                            <p className="mt-4">
                                Are you sure you want to approve this equipment
                                listing?
                            </p>
                        )}

                        {dialogAction === "Reject" && (
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium">
                                    Rejection Reason (Optional)
                                </label>

                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows={4}
                                    placeholder="Explain why this listing is being rejected..."
                                    value={rejectionReason}
                                    onChange={event =>
                                        setRejectionReason(event.target.value)
                                    }
                                />
                            </div>
                        )}

                        {dialogAction === "Delete" && (
                            <p className="mt-4 text-error">
                                Are you sure you want to permanently delete this
                                equipment listing?
                            </p>
                        )}

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                disabled={actionLoading}
                                onClick={closeDialog}
                            >
                                Cancel
                            </button>

                            <button
                                className={`btn ${dialogAction === "Reject" ||
                                    dialogAction === "Delete"
                                    ? "btn-error"
                                    : "btn-primary"
                                    }`}
                                disabled={actionLoading}
                                onClick={handleConfirmAction}
                            >
                                {actionLoading
                                    ? "Please wait..."
                                    : dialogAction === "Approve"
                                        ? "Approve"
                                        : dialogAction === "Reject"
                                            ? "Reject Listing"
                                            : "Delete Equipment"}
                            </button>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop"
                        onClick={closeDialog}
                    />
                </div>
            )}
        </section>
    );
};

export default AdminEquipmentClient;