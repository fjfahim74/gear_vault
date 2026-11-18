import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import UserProfile from "./UserProfile";

const DesktopNav = ({
    session,
    isPending,
    isDark,
    isProfileOpen,
    handleThemeChange,
    setIsProfileOpen,
    handleSignOut,
}: any) => {
    const pathname = usePathname();

    return (
        <>
            {/* Center Navigation */}
            <div className="navbar-center hidden items-center gap-6 md:flex">
                <Link
                    href="/"
                    className={`text-sm font-medium transition ${pathname === "/"
                            ? "font-semibold text-primary"
                            : "text-base-content hover:text-primary"
                        }`}
                >
                    Home
                </Link>

                <Link
                    href="/equipment"
                    className={`text-sm font-medium transition ${pathname.startsWith("/equipment")
                            ? "font-semibold text-primary"
                            : "text-base-content hover:text-primary"
                        }`}
                >
                    All Equipment
                </Link>

                <Link
                    href="/how-it-works"
                    className={`text-sm font-medium transition ${pathname === "/how-it-works"
                            ? "font-semibold text-primary"
                            : "text-base-content hover:text-primary"
                        }`}
                >
                    How It Works
                </Link>

                <Link
                    href="/about"
                    className={`text-sm font-medium transition ${pathname === "/about"
                            ? "font-semibold text-primary"
                            : "text-base-content hover:text-primary"
                        }`}
                >
                    About
                </Link>

                <Link
                    href="/contact"
                    className={`text-sm font-medium transition ${pathname === "/contact"
                            ? "font-semibold text-primary"
                            : "text-base-content hover:text-primary"
                        }`}
                >
                    Contact
                </Link>

                {!isPending && session && (
                    <Link
                        href="/dashboard"
                        className={`text-sm font-semibold transition ${pathname.startsWith("/dashboard")
                                ? "text-primary"
                                : "text-base-content hover:text-primary"
                            }`}
                    >
                        Dashboard
                    </Link>
                )}
            </div>

            {/* Right Navigation */}
            <div className="navbar-end hidden items-center gap-5 md:flex">

                {/* Theme Toggle */}
                <button
                    onClick={handleThemeChange}
                    className="btn btn-ghost btn-circle text-base-content"
                    aria-label="Toggle theme"
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDark ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </button>

                {/* Authentication */}
                {isPending ? (
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 animate-pulse rounded-full bg-base-300" />
                        <div className="h-4 w-16 animate-pulse rounded bg-base-300" />
                    </div>
                ) : !session ? (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/sign-in"
                            className="font-semibold text-base-content transition hover:text-primary"
                        >
                            Login
                        </Link>

                        <Link
                            href="/sign-up"
                            className="btn border-none bg-primary text-primary-content shadow-sm hover:brightness-95"
                        >
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <UserProfile
                        user={session.user}
                        isOpen={isProfileOpen}
                        onToggle={() => setIsProfileOpen(!isProfileOpen)}
                        onClose={() => setIsProfileOpen(false)}
                        onSignOut={handleSignOut}
                    />
                )}
            </div>
        </>
    );
};

export default DesktopNav;