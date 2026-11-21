"use client";

import { useCallback, useEffect, useState } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Label,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {
    Package,
    CheckCircle,
    Wallet,
    CalendarDays,
    RefreshCw
} from "lucide-react";

interface DashboardData {
    totalEquipment: number;
    completedRentals: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    currency: string;
    monthlyEarnings: {
        month: string;
        earnings: number;
    }[];
    listingsByStatus: {
        status: string;
        count: number;
    }[];
    topEquipment: {
        name: string;
        earnings: number;
    }[];
    recentRequests: {
        _id: string;
        customerName: string;
        equipmentName: string;
        totalAmount: number;
        bookingStatus: string;
        createdAt: string;
    }[];
}

interface OwnerDashboardProps {
    userName: string;
}

const statusColors: Record<string, string> = {
    Approved: "#15803D",
    Pending: "#B45309",
    Rejected: "#B91C1C",
    Other: "#64748B"
};

const StatCard = ({
    title,
    value,
    icon: Icon
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
}) => (
    <div className="flex min-w-0 items-center gap-4 rounded-xl border border-base-300 bg-base-100 p-5">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Icon size={23} />
        </div>

        <div className="min-w-0">
            <p className="text-sm text-base-content/60">{title}</p>
            <h2 className="break-words text-xl font-bold tabular-nums">
                {value}
            </h2>
        </div>
    </div>
);

const ChartCard = ({
    title,
    subtitle,
    children,
    empty
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    empty: boolean;
}) => (
    <section className="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mb-5 text-sm text-base-content/60">{subtitle}</p>

        {empty ? (
            <div className="flex h-60 items-center justify-center text-sm text-base-content/50">
                No earnings yet.
            </div>
        ) : (
            children
        )}
    </section>
);

const OwnerDashboardClient = ({ userName }: OwnerDashboardProps) => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/analytics/owner`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load dashboard.");
            }

            setData(await response.json());

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
        fetchDashboard();
    }, [fetchDashboard]);

    const formatAmount = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: (data?.currency || "usd").toUpperCase()
        }).format(amount);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 animate-pulse rounded bg-base-300" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map(item => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-xl bg-base-300"
                        />
                    ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="h-80 animate-pulse rounded-xl bg-base-300" />
                    <div className="h-80 animate-pulse rounded-xl bg-base-300" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-error/30 bg-base-100 p-8 text-center">
                <p className="text-error">{error}</p>
                <button
                    onClick={fetchDashboard}
                    className="btn btn-primary btn-sm mt-4"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        {
            title: "Listed Equipment",
            value: data.totalEquipment,
            icon: Package
        },
        {
            title: "Completed Rentals",
            value: data.completedRentals,
            icon: CheckCircle
        },
        {
            title: "Total Earnings",
            value: formatAmount(data.totalEarnings),
            icon: Wallet
        },
        {
            title: "This Month",
            value: formatAmount(data.thisMonthEarnings),
            icon: CalendarDays
        }
    ];

    const totalListings = data.listingsByStatus.reduce(
        (total, item) => total + item.count,
        0
    );

    return (
        <div className="w-full min-w-0 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Welcome back, {userName?.split(" ")[0]}!
                </h1>
                <p className="mt-1 text-sm text-base-content/60">
                    Here's how your rental business is performing.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(stat => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Monthly Earnings and Listings */}
            <div className="grid min-w-0 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ChartCard
                        title="Monthly Earnings"
                        subtitle="Your earnings over the last 12 months."
                        empty={!data.monthlyEarnings.some(item => item.earnings > 0)}
                    >
                        <div
                            className="h-60 w-full md:h-70"
                            aria-label="Monthly earnings area chart"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlyEarnings}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis dataKey="month" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip
                                        formatter={value =>
                                            formatAmount(Number(value))
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#F4A300"
                                        strokeWidth={2}
                                        fill="#F4A300"
                                        fillOpacity={0.15}
                                        dot={false}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="sr-only">
                            Monthly earnings for the last twelve months.
                        </p>
                    </ChartCard>
                </div>

                <ChartCard
                    title="Listings by Status"
                    subtitle="Your equipment approval status."
                    empty={data.listingsByStatus.length === 0}
                >
                    <div
                        className="h-60 w-full"
                        aria-label="Equipment listings by status donut chart"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.listingsByStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                >
                                    {data.listingsByStatus.map(item => (
                                        <Cell
                                            key={item.status}
                                            fill={
                                                statusColors[item.status] ||
                                                statusColors.Other
                                            }
                                        />
                                    ))}
                                    <Label
                                        value={totalListings}
                                        position="center"
                                        className="fill-base-content text-xl font-bold"
                                    />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                        {data.listingsByStatus.map(item => (
                            <div
                                key={item.status}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                statusColors[item.status] ||
                                                statusColors.Other
                                        }}
                                    />
                                    {item.status}
                                </span>
                                <span className="font-semibold">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* Top Earning Equipment */}
            <ChartCard
                title="Top Earning Equipment"
                subtitle="Your five highest earning equipment items."
                empty={data.topEquipment.length === 0}
            >
                <div
                    className="h-60 w-full md:h-70"
                    aria-label="Top earning equipment horizontal bar chart"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.topEquipment}
                            layout="vertical"
                            margin={{ left: 10, right: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                            />
                            <XAxis type="number" fontSize={12} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={110}
                                fontSize={12}
                            />
                            <Tooltip
                                formatter={value =>
                                    formatAmount(Number(value))
                                }
                            />
                            <Bar
                                dataKey="earnings"
                                fill="#0F2B46"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="sr-only">
                    Equipment ranked by total verified payment earnings.
                </p>
            </ChartCard>

            {/* Recent Rental Requests */}
            <section className="min-w-0 rounded-xl border border-base-300 bg-base-100 p-5">
                <h2 className="mb-4 text-lg font-semibold">
                    Recent Rental Requests
                </h2>

                {data.recentRequests.length === 0 ? (
                    <p className="py-10 text-center text-sm text-base-content/50">
                        No rental requests yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Equipment</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentRequests.map(request => (
                                    <tr key={request._id}>
                                        <td className="font-medium">
                                            {request.customerName}
                                        </td>
                                        <td>{request.equipmentName}</td>
                                        <td className="whitespace-nowrap">
                                            {formatAmount(request.totalAmount)}
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">
                                                {request.bookingStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default OwnerDashboardClient;