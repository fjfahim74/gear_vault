"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type UserProfileProps = {
    user: {
        name: string;
        email: string;
        image?: string | null;
        role: "Customer" | "Owner" | "Admin";
    };
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onSignOut: () => void;
    variant?: "desktop" | "mobile";
};

const roleBasedMenuItems = {
    Customer: [
        { title: "My Rentals", href: "/dashboard/customer/rental" },
        { title: "Favorites", href: "/dashboard/customer/favorites" },
        { title: "Profile", href: "/dashboard/customer/profile" },
    ],
    Owner: [
        { title: "Add Equipment", href: "/dashboard/owner/add-equipment" },
        { title: "My Equipment", href: "/dashboard/owner/equipment" },
        { title: "Profile", href: "/dashboard/owner/profile" },
        { title: "My Equipment Rental", href: "/dashboard/owner/rentals" },
    ],
    Admin: [
        { title: "Admin Overview", href: "/dashboard/admin" },
        { title: "Profile", href: "/dashboard/admin/profile" },
    ],
};

const UserProfile = ({
    user,
    isOpen,
    onToggle,
    onClose,
    onSignOut,
    variant = "desktop",
}: UserProfileProps) => {
    const profileRef = useRef<HTMLDivElement>(null);

    const [mobileImageError, setMobileImageError] = useState(false);
    const [desktopImageError, setDesktopImageError] = useState(false);

    const menuItems = roleBasedMenuItems[user.role];

    const roleBadgeClass =
        user.role === "Admin"
            ? "bg-secondary/10 text-secondary"
            : user.role === "Owner"
                ? "bg-accent/10 text-accent"
                : "bg-base-300 text-base-content/70";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Mobile Profile
    if (variant === "mobile") {
        return (
            <div className="flex flex-col gap-1">
                <div className="mb-2 flex items-center gap-3 border-b border-base-300 pb-4">
                    {user.image && !mobileImageError ? (
                        <Image
                            src={user.image}
                            alt="Profile"
                            width={42}
                            height={42}
                            unoptimized
                            onError={() => setMobileImageError(true)}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-semibold text-primary-content shadow-sm">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-base-content">
                            {user.name}
                        </p>
                        <p className="truncate text-xs text-base-content/60">
                            {user.email}
                        </p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadgeClass}`}>
                            {user.role}
                        </span>
                    </div>
                </div>

                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                    >
                        <span>›</span>
                        <span>{item.title}</span>
                    </Link>
                ))}

                <div className="mt-2 border-t border-base-300 pt-2">
                    <button
                        onClick={onSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition hover:bg-error/10"
                    >
                        <span>➔</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        );
    }

    // Desktop Profile
    return (
        <div ref={profileRef} className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="group flex cursor-pointer items-center rounded-full p-0.5 transition focus:outline-none"
                title={user.name}
            >
                {user.image && !desktopImageError ? (
                    <Image
                        src={user.image}
                        alt="Profile"
                        width={38}
                        height={38}
                        unoptimized
                        onError={() => setDesktopImageError(true)}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-primary/30"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-content ring-2 ring-transparent transition group-hover:ring-primary/30">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-[100] mt-3 w-64 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
                    <div className="mb-2 border-b border-base-300 px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-base-content">
                            {user.name}
                        </p>
                        <p className="truncate text-xs text-base-content/60">
                            {user.email}
                        </p>
                        <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadgeClass}`}
                        >
                            {user.role}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <Link
                            href="/dashboard"
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-base-content transition hover:bg-base-300"
                        >
                            <span>›</span>
                            <span>Dashboard</span>
                        </Link>
                    </div>

                    <div className="mt-2 border-t border-base-300 pt-2">
                        <button
                            type="button"
                            onClick={onSignOut}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-error transition hover:bg-error/10"
                        >
                            ➔ <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;