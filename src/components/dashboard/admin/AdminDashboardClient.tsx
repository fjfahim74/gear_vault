"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users, Boxes, Receipt, Clock, CheckCircle, Wallet,
    ArrowRight, RefreshCw, Check, X, Package
} from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, PieChart, Pie, Cell,
    AreaChart, Area
} from "recharts";

interface Analytics {
    totalUsers: number;
    totalEquipment: number;
    totalBookings: number;
    pendingApprovals: number;
    completedRentals: number;
    totalRevenue: number;
    currency: string;
    monthlyStats: {
        month: string;
        year: number;
        bookings: number;
        revenue: number;
    }[];
    equipmentByStatus: {
        status: string;
        count: number;
    }[];
    recentPendingApprovals: {
        _id: string;
        name: string;
        imageUrl?: string;
        ownerName: string;
        ownerEmail: string;
    }[];
}

const statusColors: Record<string, string> = {
    Approved: "#15803D",
    Pending: "#F4A300",
    Rejected: "#DC2626",
    Unknown: "#64748B"
};

const AdminDashboardClient = ({ userName }: { userName: string }) => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getTokenFromClient();

            if (!token) throw new Error("Please sign in again.");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/analytics/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load analytics.");
            }

            setAnalytics(data);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const updateEquipmentStatus = async (
        item: Analytics["recentPendingApprovals"][number],
        status: "Approved" | "Rejected"
    ) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this equipment?`)) {
            return;
        }

        let rejectionReason = "";

        if (status === "Rejected") {
            const reason = window.prompt("Enter rejection reason (optional):");
            if (reason === null) return;
            rejectionReason = reason;
        }

        try {
            setActionId(item._id);

            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/admin/${item._id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status, rejectionReason })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update equipment.");
            }

            toast.success(`Equipment ${status.toLowerCase()} successfully.`);
            await fetchAnalytics();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setActionId("");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: (analytics?.currency || "usd").toUpperCase(),
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return <div className="py-20 text-center">Loading analytics...</div>;
    }

    if (error || !analytics) {
        return (
            <div className="rounded-xl border border-base-300 p-8 text-center">
                <p className="text-error">{error || "Unable to load analytics."}</p>
                <button onClick={fetchAnalytics} className="btn btn-primary mt-4">
                    <RefreshCw size={16} /> Try Again
                </button>
            </div>
        );
    }

    const stats = [
        { title: "Total Users", value: analytics.totalUsers, icon: Users },
        { title: "Total Equipment", value: analytics.totalEquipment, icon: Boxes },
        { title: "Total Bookings", value: analytics.totalBookings, icon: Receipt },
        { title: "Pending Approvals", value: analytics.pendingApprovals, icon: Clock },
        { title: "Completed Rentals", value: analytics.completedRentals, icon: CheckCircle },
        { title: "Total Revenue", value: formatCurrency(analytics.totalRevenue), icon: Wallet }
    ];

    const totalEquipment = analytics.equipmentByStatus.reduce(
        (total, item) => total + item.count,
        0
    );

    return (
        <section className="space-y-8">

            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                        Administration
                    </p>
                    <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                        Welcome back, {userName}!
                    </h1>
                    <p className="mt-2 text-sm text-base-content/60">
                        Monitor your GearVault platform performance.
                    </p>
                </div>

                <button onClick={fetchAnalytics} className="btn btn-outline btn-sm">
                    <RefreshCw size={15} /> Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {stats.map((item, index) => {
                    const Icon = item.icon;

                    const card = (
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-base-content/60">
                                    {item.title}
                                </p>
                                <h2 className="mt-3 text-2xl font-bold">
                                    {item.value}
                                </h2>
                            </div>
                            <Icon className="text-primary" size={28} />
                        </div>
                    );

                    return index === 3 ? (
                        <Link
                            key={item.title}
                            href="/dashboard/admin/equipment"
                            className="rounded-xl border border-amber-300/50 bg-amber-500/10 p-5"
                        >
                            {card}
                        </Link>
                    ) : (
                        <div key={item.title} className="rounded-xl border border-base-300 bg-base-100 p-5">
                            {card}
                        </div>
                    );
                })}
            </div>

            {/* Monthly Bookings and Equipment Status */}
            <div className="grid gap-5 lg:grid-cols-12">

                <div className="rounded-xl border border-base-300 bg-base-100 p-5 lg:col-span-8">
                    <h2 className="font-bold">Monthly Bookings</h2>
                    <p className="mt-1 text-sm text-base-content/60">
                        Booking statistics for the last 12 months.
                    </p>

                    {analytics.monthlyStats.some(item => item.bookings > 0) ? (
                        <div className="mt-5 h-60 sm:h-[280px]" aria-label="Monthly bookings bar chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="bookings" fill="#0F2B46" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="py-20 text-center text-sm text-base-content/50">
                            No booking activity yet.
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-5 lg:col-span-4">
                    <h2 className="font-bold">Equipment by Status</h2>
                    <p className="mt-1 text-sm text-base-content/60">
                        Current equipment distribution.
                    </p>

                    {totalEquipment > 0 ? (
                        <>
                            <div className="relative mt-3 h-60" aria-label="Equipment status donut chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.equipmentByStatus}
                                            dataKey="count"
                                            nameKey="status"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={3}
                                        >
                                            {analytics.equipmentByStatus.map(item => (
                                                <Cell
                                                    key={item.status}
                                                    fill={statusColors[item.status] || statusColors.Unknown}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold">{totalEquipment}</span>
                                    <span className="text-xs text-base-content/60">Equipment</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 text-xs">
                                {analytics.equipmentByStatus.map(item => (
                                    <span key={item.status}>
                                        <span
                                            className="mr-1 inline-block h-2 w-2 rounded-full"
                                            style={{ backgroundColor: statusColors[item.status] || statusColors.Unknown }}
                                        />
                                        {item.status}: {item.count}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="py-20 text-center text-sm text-base-content/50">
                            No equipment available.
                        </p>
                    )}
                </div>
            </div>

            {/* Revenue and Pending Approvals */}
            <div className="grid gap-5 lg:grid-cols-12">

                <div className="rounded-xl border border-base-300 bg-base-100 p-5 lg:col-span-8">
                    <h2 className="font-bold">Monthly Revenue</h2>
                    <p className="mt-1 text-sm text-base-content/60">
                        Revenue from verified payments.
                    </p>

                    {analytics.monthlyStats.some(item => item.revenue > 0) ? (
                        <div className="mt-5 h-60 sm:h-[280px]" aria-label="Monthly revenue area chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatCurrency(Number(value || 0))} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#F4A300"
                                        strokeWidth={2}
                                        fill="#F4A300"
                                        fillOpacity={0.15}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="py-20 text-center text-sm text-base-content/50">
                            No revenue recorded yet.
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-5 lg:col-span-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold">Pending Approvals</h2>
                            <p className="mt-1 text-sm text-base-content/60">
                                Recent equipment listings.
                            </p>
                        </div>
                        <span className="badge badge-warning">
                            {analytics.pendingApprovals}
                        </span>
                    </div>

                    {analytics.recentPendingApprovals.length > 0 ? (
                        <div className="mt-5 space-y-4">
                            {analytics.recentPendingApprovals.map(item => (
                                <div key={item._id} className="border-b border-base-300 pb-4 last:border-0">
                                    <div className="flex items-center gap-3">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-11 w-11 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <Package size={24} />
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {item.name}
                                            </p>
                                            <p className="truncate text-xs text-base-content/60">
                                                {item.ownerName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            disabled={actionId === item._id}
                                            onClick={() => updateEquipmentStatus(item, "Approved")}
                                            className="btn btn-success btn-xs"
                                        >
                                            <Check size={13} /> Approve
                                        </button>

                                        <button
                                            disabled={actionId === item._id}
                                            onClick={() => updateEquipmentStatus(item, "Rejected")}
                                            className="btn btn-outline btn-error btn-xs"
                                        >
                                            <X size={13} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-12 text-center text-sm text-base-content/50">
                            No pending approvals.
                        </p>
                    )}

                    <Link
                        href="/dashboard/admin/equipment"
                        className="btn btn-outline btn-sm mt-4 w-full"
                    >
                        View All Equipment <ArrowRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Existing Admin Navigation */}
            <div>
                <h2 className="mb-4 text-lg font-bold">Quick Access</h2>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
                        { title: "Manage Equipment", href: "/dashboard/admin/equipment", icon: Boxes },
                        { title: "Manage Rentals", href: "/dashboard/admin/rentals", icon: Receipt },
                        { title: "My Profile", href: "/dashboard/admin/profile", icon: Users }
                    ].map(item => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-xl border border-base-300 bg-base-100 p-5 transition hover:border-primary hover:shadow-md"
                            >
                                <Icon size={24} className="text-primary" />
                                <h3 className="mt-3 font-bold">{item.title}</h3>
                                <ArrowRight size={16} className="mt-3 text-primary" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AdminDashboardClient;