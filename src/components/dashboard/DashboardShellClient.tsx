"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Cog,
    LayoutDashboard,
    PlusSquare,
    Package,
    CalendarDays,
    UserCircle,
    Heart,
    Users,
    Boxes,
    Receipt,
    ExternalLink,
    Menu,
    X,
    Sun,
    Moon,
    LogOut
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import Logo from "../shared/Logo";

interface DashboardShellProps {
    children: ReactNode;
    role: string;
    userName: string;
    userImage?: string | null;
}

const ownerLinks = [
    { title: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { title: "Add Equipment", href: "/dashboard/owner/add-equipment", icon: PlusSquare },
    { title: "My Equipment", href: "/dashboard/owner/equipment", icon: Package },
    { title: "My Equipment Rentals", href: "/dashboard/owner/rentals", icon: CalendarDays },
    { title: "My Profile", href: "/dashboard/owner/profile", icon: UserCircle }
];

const customerLinks = [
    { title: "My Rentals", href: "/dashboard/customer/rental", icon: CalendarDays },
    { title: "My Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { title: "My Profile", href: "/dashboard/customer/profile", icon: UserCircle }
];

const adminLinks = [
    { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "All Users", href: "/dashboard/admin/users", icon: Users },
    { title: "All Equipment", href: "/dashboard/admin/equipment", icon: Boxes },
    { title: "All Rentals", href: "/dashboard/admin/rentals", icon: Receipt },
    { title: "My Profile", href: "/dashboard/admin/profile", icon: UserCircle }
];

const DashboardShellClient = ({
    children,
    role,
    userName,
    userImage
}: DashboardShellProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const links =
        role === "Admin"
            ? adminLinks
            : role === "Owner"
                ? ownerLinks
                : customerLinks;

    const profileLink = `/dashboard/${role.toLowerCase()}/profile`;

    // Load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("gearvault-theme");

        const dark = savedTheme === "gearvault-dark";

        setIsDark(dark);

        document.documentElement.setAttribute(
            "data-theme",
            dark ? "gearvault-dark" : "gearvault-light"
        );
    }, []);

    // Close mobile menu after navigation
    useEffect(() => {
        setMenuOpen(false);
        setProfileOpen(false);
    }, [pathname]);

    // Theme toggle
    const handleThemeChange = () => {
        const newTheme = !isDark;

        setIsDark(newTheme);

        const theme = newTheme
            ? "gearvault-dark"
            : "gearvault-light";

        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("gearvault-theme", theme);
    };

    // Logout
    const handleLogout = async () => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error("Unable to sign out.");
                return;
            }

            toast.success("Signed out successfully.");

            router.push("/");
            router.refresh();

        } catch {
            toast.error("Something went wrong.");
        }
    };

    const getPageTitle = () => {
        if (pathname.endsWith("/edit")) return "Edit Equipment";
        if (pathname.endsWith("/profile")) return "My Profile";

        const currentLink = links.find(
            item => item.href === pathname
        );

        return currentLink?.title || "Dashboard";
    };

    return (
        <div className="min-h-screen w-full overflow-x-clip bg-base-200/50 lg:flex">

            {/* Mobile Backdrop */}
            {menuOpen && (
                <button
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    aria-label="Close navigation"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-base-300 bg-base-100 p-5 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >

                {/* Logo */}
                <Logo />

                {/* Role */}
                <div className="mt-8">
                    <span className="badge badge-primary badge-outline">
                        {role} Dashboard
                    </span>
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-1 space-y-2">
                    {links.map(item => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.href ||
                            (
                                item.href !== `/dashboard/${role.toLowerCase()}` &&
                                pathname.startsWith(`${item.href}/`)
                            );

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-3 text-sm font-medium transition ${isActive
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-transparent text-base-content/70 hover:bg-base-200"
                                    }`}
                            >
                                <Icon size={19} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Links */}
                <div className="space-y-2 border-t border-base-300 pt-4">

                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-base-content/70 hover:bg-base-200"
                    >
                        <ExternalLink size={19} />
                        Back to Website
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-error hover:bg-error/10"
                    >
                        <LogOut size={19} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="min-h-screen w-full min-w-0 flex-1">

                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-base-300 bg-base-100 px-5 sm:px-8">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setMenuOpen(true)}
                            className="btn btn-ghost btn-square btn-sm lg:hidden"
                        >
                            <Menu size={22} />
                        </button>

                        <div>
                            <p className="hidden text-xs text-base-content/50 sm:block">
                                GearVault Dashboard
                            </p>

                            <h1 className="text-lg font-bold">
                                {getPageTitle()}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        {/* Theme Toggle */}
                        <button
                            onClick={handleThemeChange}
                            className="btn btn-ghost btn-circle btn-sm"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 rounded-full hover:bg-base-200"
                            >
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        alt={userName}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <span className="hidden text-sm font-semibold sm:block">
                                    {userName}
                                </span>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-base-300 bg-base-100 p-2 shadow-lg">

                                    <Link
                                        href={profileLink}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
                                    >
                                        <UserCircle size={17} />
                                        My Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error hover:bg-error/10"
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </div>
                            )}
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

export default DashboardShellClient;