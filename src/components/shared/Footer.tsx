import Link from "next/link";
import { Cog } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-base-300 bg-base-100">
            <div className="mx-auto max-w-7xl px-4 py-12">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">

                    {/* Brand */}
                    <div className="flex flex-col items-start gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
                                <Cog className="h-5 w-5" />
                            </div>

                            <span className="text-xl font-extrabold text-base-content">
                                Gear<span className="text-primary">Vault</span>
                            </span>
                        </Link>

                        <p className="max-w-xs text-sm leading-relaxed text-base-content/70">
                            Rent the right gear. Skip the cost of owning it.
                            Find quality equipment for your next project or adventure.
                        </p>
                    </div>

                    {/* Explore */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-base-content">
                            Explore
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <Link href="/" className="text-base-content/70 transition hover:text-primary">
                                Home
                            </Link>

                            <Link href="/equipment" className="text-base-content/70 transition hover:text-primary">
                                All Equipment
                            </Link>

                            <Link href="/how-it-works" className="text-base-content/70 transition hover:text-primary">
                                How It Works
                            </Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-base-content">
                            Company
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <Link href="/about" className="text-base-content/70 transition hover:text-primary">
                                About Us
                            </Link>

                            <Link href="/contact" className="text-base-content/70 transition hover:text-primary">
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-base-content">
                            Your Account
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <Link href="/sign-in" className="text-base-content/70 transition hover:text-primary">
                                Login
                            </Link>

                            <Link href="/sign-up" className="text-base-content/70 transition hover:text-primary">
                                Get Started
                            </Link>
                        </div>

                        <p className="text-sm leading-relaxed text-base-content/60">
                            Quality equipment, when you need it.
                        </p>
                    </div>

                </div>

                {/* Divider */}
                <div className="mt-10 border-t border-base-300 pt-6">
                    <p className="text-center text-xs text-base-content/60">
                        © 2026 GearVault. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;