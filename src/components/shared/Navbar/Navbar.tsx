"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { Cog } from "lucide-react";

const Navbar = () => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("gearvault-theme");

        const theme = savedTheme === "gearvault-dark"
            ? "gearvault-dark"
            : "gearvault-light";

        document.documentElement.setAttribute("data-theme", theme);

        setIsDark(theme === "gearvault-dark");
    }, []);

    const handleThemeChange = () => {
        const newTheme = !isDark;
        const theme = newTheme ? "gearvault-dark" : "gearvault-light";

        setIsDark(newTheme);

        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("gearvault-theme", theme);
    };

    const handleSignOut = async () => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error("Unable to sign out. Please try again.");
                return;
            }

            toast.success("Signed out successfully!");

            setIsProfileOpen(false);
            setIsMenuOpen(false);

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Something went wrong while signing out.");
        }
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
            <div className="navbar mx-auto max-w-7xl px-4">

                {/* Logo */}
                <div className="navbar-start">     <Link href="/" className="group flex items-center gap-2.5">         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-sm transition-transform group-hover:scale-105">
                    <Cog className="h-6 w-6" strokeWidth={2.2} />       </div>

                    <span className="text-xl font-extrabold tracking-tight text-base-content">
                        GearVault
                    </span>
                </Link>

                </div>

                {/* Desktop Navigation */}
                <DesktopNav
                    session={session}
                    isPending={isPending}
                    isDark={isDark}
                    isProfileOpen={isProfileOpen}
                    handleThemeChange={handleThemeChange}
                    setIsProfileOpen={setIsProfileOpen}
                    handleSignOut={handleSignOut}
                />

                {/* Mobile Navigation */}
                <MobileNav
                    session={session}
                    isPending={isPending}
                    isMenuOpen={isMenuOpen}
                    isDark={isDark}
                    handleThemeChange={handleThemeChange}
                    setIsMenuOpen={setIsMenuOpen}
                    handleSignOut={handleSignOut}
                />

            </div>
        </nav>
    );
};

export default Navbar;