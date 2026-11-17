"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type UserProfileProps = {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onSignOut: () => void;
    variant?: "desktop" | "mobile";
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
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 font-semibold text-white shadow-sm">
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
                    </div>
                </div>

                <Link
                    href="/create-event"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                >
                    <span>⊕</span>
                    <span>Create Event</span>
                </Link>

                <Link
                    href="/manage-events"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                >
                    <span>⚙️</span>
                    <span>Manage Events</span>
                </Link>

                <Link
                    href="/joined-events"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                >
                    <span>✓</span>
                    <span>Joined Events</span>
                </Link>

                <div className="mt-2 border-t border-base-300 pt-2">
                    <button
                        onClick={onSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
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
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-emerald-600/30"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-xs font-semibold text-white ring-2 ring-transparent transition group-hover:ring-emerald-600/30">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-[100] mt-3 w-64 rounded-2xl border border-base-300 bg-base-200 p-2 shadow-xl">
                    <div className="mb-2 border-b border-base-300 px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-base-content">
                            {user.name}
                        </p>
                        <p className="truncate text-xs text-base-content/60">
                            {user.email}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <Link
                            href="/create-event"
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                        >
                            ⊕ <span>Create Event</span>
                        </Link>

                        <Link
                            href="/manage-events"
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                        >
                            ⚙️ <span>Manage Events</span>
                        </Link>

                        <Link
                            href="/joined-events"
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-base-content/80 transition hover:bg-base-300"
                        >
                            ✓ <span>Joined Events</span>
                        </Link>
                    </div>

                    <div className="mt-2 border-t border-base-300 pt-2">
                        <button
                            type="button"
                            onClick={onSignOut}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
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