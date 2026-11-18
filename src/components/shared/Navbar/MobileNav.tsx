import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import UserProfile from "./UserProfile";

const MobileNav = ({
    session,
    isPending,
    isMenuOpen,
    isDark,
    handleThemeChange,
    setIsMenuOpen,
    handleSignOut,
}: any) => {
    const pathname = usePathname();

    const closeMenu = () => setIsMenuOpen(false);

    const getLinkClass = (isActive: boolean) =>
        `font - medium transition ${isActive
            ? "font-semibold text-primary"
            : "text-base-content hover:text-primary"
        } `;

    return (
        <div className="navbar-end md:hidden">
            {/* Theme Toggle */}
            <button
                onClick={handleThemeChange}
                className="btn btn-ghost btn-circle text-base-content"
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
            </button>

            {/* Menu Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn btn-ghost btn-circle text-base-content"
                aria-label="Toggle menu"
            >
                {isMenuOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <>
                    <button
                        onClick={closeMenu}
                        className="fixed inset-0 z-40 cursor-default"
                        aria-label="Close menu"
                    />

                    <div className="absolute left-0 top-full z-50 w-full border-t border-base-300 bg-base-100 p-5 shadow-lg">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                onClick={closeMenu}
                                className={getLinkClass(pathname === "/")}
                            >
                                Home
                            </Link>

                            <Link
                                href="/equipment"
                                onClick={closeMenu}
                                className={getLinkClass(pathname.startsWith("/equipment"))}
                            >
                                All Equipment
                            </Link>

                            <Link
                                href="/how-it-works"
                                onClick={closeMenu}
                                className={getLinkClass(pathname === "/how-it-works")}
                            >
                                How It Works
                            </Link>

                            <Link
                                href="/about"
                                onClick={closeMenu}
                                className={getLinkClass(pathname === "/about")}
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                onClick={closeMenu}
                                className={getLinkClass(pathname === "/contact")}
                            >
                                Contact
                            </Link>

                            <div className="my-1 border-t border-base-300" />

                            {isPending ? (
                                <div className="h-5 w-24 animate-pulse rounded bg-base-300" />
                            ) : !session ? (
                                <div className="flex flex-col gap-4">
                                    <Link
                                        href="/sign-in"
                                        onClick={closeMenu}
                                        className="font-semibold text-base-content hover:text-primary"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/sign-up"
                                        onClick={closeMenu}
                                        className="btn border-none bg-primary text-primary-content"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className={getLinkClass(pathname.startsWith("/dashboard"))}
                                    >
                                        Dashboard
                                    </Link>

                                    <UserProfile
                                        user={session.user}
                                        isOpen={false}
                                        onToggle={() => { }}
                                        onClose={closeMenu}
                                        onSignOut={handleSignOut}
                                        variant="mobile"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MobileNav;