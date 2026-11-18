import Link from "next/link";
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
    return (
        <>
            {/* Center Navigation */}
            {/* Center Navigation */}
            <div className="navbar-center hidden items-center gap-6 md:flex">
                <Link
                    href="/"
                    className="text-sm font-medium text-base-content transition hover:text-accent"
                >
                    Home
                </Link>

                <Link
                    href="/equipment"
                    className="text-sm font-medium text-base-content transition hover:text-accent"
                >
                    All Equipment
                </Link>

                <Link
                    href="/how-it-works"
                    className="text-sm font-medium text-base-content transition hover:text-accent"
                >
                    How It Works
                </Link>

                <Link
                    href="/about"
                    className="text-sm font-medium text-base-content transition hover:text-accent"
                >
                    About
                </Link>

                <Link
                    href="/contact"
                    className="text-sm font-medium text-base-content transition hover:text-accent"
                >
                    Contact
                </Link>

                {!isPending && session && (
                    <Link
                        href="/dashboard"
                        className="text-sm font-semibold text-accent transition hover:underline"
                    >
                        Dashboard
                    </Link>
                )}
            </div>

            {/* Right Navigation */}
            <div className="navbar-end hidden items-center gap-6 md:flex">

                {/* Theme Toggle */}
                <button
                    onClick={handleThemeChange}
                    className="btn btn-ghost btn-circle"
                    aria-label="Toggle theme"
                >
                    {isDark ? "☀️" : "🌙"}
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
                            className="font-medium text-base-content hover:text-emerald-500"
                        >
                            Login
                        </Link>

                        <Link
                            href="/sign-up"
                            className="btn border-none bg-green-700 text-white hover:bg-green-800"
                        >
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <UserProfile
                            user={session.user}
                            isOpen={isProfileOpen}
                            onToggle={() => setIsProfileOpen(!isProfileOpen)}
                            onClose={() => setIsProfileOpen(false)}
                            onSignOut={handleSignOut}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default DesktopNav;