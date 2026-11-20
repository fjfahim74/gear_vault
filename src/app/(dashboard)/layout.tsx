import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    Cog,
    LayoutDashboard,
    PlusSquare,
    Package,
    CalendarDays,
    UserCircle,
    Heart,
    ExternalLink,
} from "lucide-react";

import { auth } from "@/lib/auth";

const ownerLinks = [
    {
        title: "Overview",
        href: "/dashboard/owner",
        icon: LayoutDashboard,
    },
    {
        title: "Add Equipment",
        href: "/dashboard/owner/add-equipment",
        icon: PlusSquare,
    },
    {
        title: "My Equipment",
        href: "/dashboard/owner/equipment",
        icon: Package,
    },
    {
        title: "My Equipment Rentals",
        href: "/dashboard/owner/rentals",
        icon: CalendarDays,
    },
    {
        title: "My Profile",
        href: "/dashboard/owner/profile",
        icon: UserCircle,
    },
];

const customerLinks = [
    {
        title: "Overview",
        href: "/dashboard/customer",
        icon: LayoutDashboard,
    },
    {
        title: "My Rentals",
        href: "/dashboard/customer/rental",
        icon: CalendarDays,
    },
    {
        title: "My Favorites",
        href: "/dashboard/customer/favorites",
        icon: Heart,
    },
    {
        title: "My Profile",
        href: "/dashboard/customer/profile",
        icon: UserCircle,
    },
];

const adminLinks = [
    {
        title: "Overview",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
    },
];

const DashboardLayout = async ({
    children,
}: {
    children: ReactNode;
}) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role ?? "Customer";

    if (!["Owner", "Customer", "Admin"].includes(role)) {
        redirect("/sign-in");
    }

    const dashboardLinks =
        role === "Owner"
            ? ownerLinks
            : role === "Admin"
                ? adminLinks
                : customerLinks;

    const userName = session.user.name || role;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-base-200/40 lg:flex">
            {/* Sidebar */}
            <aside className="w-full border-b border-base-300 bg-base-100 p-5 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">

                {/* Logo */}
                <Link
                    href={`/dashboard/${role.toLowerCase()}`}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content">
                        <Cog size={25} />
                    </div>

                    <span className="text-2xl font-extrabold text-base-content">
                        GearVault
                    </span>
                </Link>

                {/* Navigation */}
                <div className="mt-8">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                        {role} Menu
                    </p>

                    <nav className="flex flex-wrap gap-2 lg:flex-col">
                        {dashboardLinks.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-base-content/70 transition hover:bg-base-200 hover:text-primary"
                                >
                                    <Icon size={19} />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Visit Website */}
                <Link
                    href="/"
                    className="mt-8 flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-base-content/60 transition hover:bg-base-200 hover:text-primary"
                >
                    <ExternalLink size={18} />
                    Visit Website
                </Link>
            </aside>

            {/* Main Content */}
            <div className="min-w-0 flex-1">

                {/* Topbar */}
                <header className="flex items-center justify-between gap-4 border-b border-base-300 bg-base-100 px-5 py-4 sm:px-8">
                    <div>
                        <p className="text-sm text-base-content/50">
                            GearVault Dashboard
                        </p>

                        <h1 className="text-lg font-bold text-base-content">
                            {role} Workspace
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content">
                            {userInitial}
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-base-content">
                                {userName}
                            </p>

                            <p className="text-xs text-base-content/50">
                                {role}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-5 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;