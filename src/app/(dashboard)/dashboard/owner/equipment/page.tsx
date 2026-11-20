"use client";

import { useEffect, useState } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

type Equipment = {
    _id: string;
    name: string;
    category: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    status: "Pending" | "Approved" | "Rejected";
};

const MyEquipmentPage = () => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this equipment?"
        );

        if (!confirmed) return;

        try {
            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete equipment.");
            }

            setEquipment((prev) => prev.filter((item) => item._id !== id));
            alert("Equipment deleted successfully.");
        } catch (error) {
            alert(
                error instanceof Error ? error.message : "Something went wrong."
            );
        }
    };

    useEffect(() => {
        const fetchMyEquipment = async () => {
            try {
                const token = await getTokenFromClient();

                if (!token) {
                    throw new Error("Authentication required. Please sign in again.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/equipment/my-equipment`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load your equipment.");
                }

                const data = await response.json();
                setEquipment(data);
            } catch (error) {
                console.error(error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyEquipment();
    }, []);

    return (
        <section>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">My Equipment</h1>
                <p className="mt-2 text-base-content/60">
                    Manage all the equipment you have listed on GearVault.
                </p>
            </div>

            {loading ? (
                <div className="py-12 text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-3">Loading your equipment...</p>
                </div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : equipment.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <h2 className="text-lg font-semibold">
                        No Equipment Listed Yet
                    </h2>
                    <p className="mt-2 text-sm text-base-content/60">
                        Your equipment listings will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Equipment Name</th>
                                <th>Category</th>
                                <th>Rental Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {equipment.map((item) => (
                                <tr key={item._id}>
                                    <td className="font-semibold">
                                        {item.name}
                                    </td>

                                    <td>{item.category}</td>

                                    <td>
                                        ৳{item.rentalPrice} / {item.rentalType}
                                    </td>

                                    <td>{item.availableQuantity}</td>

                                    <td>
                                        <span
                                            className={`badge ${item.status === "Approved"
                                                ? "badge-success"
                                                : item.status === "Rejected"
                                                    ? "badge-error"
                                                    : "badge-warning"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="flex gap-2">
                                        <Link
                                            href={`/dashboard/owner/equipment/${item._id}/edit`}
                                            className="btn btn-sm btn-outline btn-primary"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="btn btn-sm btn-error btn-outline"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
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

export default MyEquipmentPage;