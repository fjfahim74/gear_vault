import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Users,
    Boxes,
    Receipt,
    UserCircle,
    ArrowRight
} from "lucide-react";

import { auth } from "@/lib/auth";

const adminActions = [
    {
        title: "Manage Users",
        description: "View registered users and manage their roles.",
        href: "/dashboard/admin/users",
        icon: Users
    },
    {
        title: "Manage Equipment",
        description: "Review equipment listings and manage approvals.",
        href: "/dashboard/admin/equipment",
        icon: Boxes
    },
    {
        title: "Manage Rentals",
        description: "Monitor bookings and manage rental activities.",
        href: "/dashboard/admin/rentals",
        icon: Receipt
    },
    {
        title: "My Profile",
        description: "View and update your personal information.",
        href: "/dashboard/admin/profile",
        icon: UserCircle
    }
];

const AdminDashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Admin") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return (
        <section className="space-y-8">

            {/* Welcome */}
            <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Administration
                </p>

                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Welcome back, {session.user.name}!
                </h1>

                <p className="mt-2 text-base-content/60">
                    Manage users, equipment listings, and rental activities
                    from your Admin workspace.
                </p>
            </div>

            {/* Admin Actions */}
            <div>
                <h2 className="mb-4 text-lg font-bold">
                    Quick Access
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {adminActions.map(item => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-xl border border-base-300 bg-base-100 p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-4 font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-base-content/60">
                                    {item.description}
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                                    Open
                                    <ArrowRight
                                        size={16}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Information */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
                <h2 className="font-bold">
                    Admin Workspace
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                    Use the navigation menu to manage the GearVault platform.
                    You can review users, control equipment listings, and
                    monitor rental bookings from their respective pages.
                </p>
            </div>
        </section>
    );
};

export default AdminDashboardPage;