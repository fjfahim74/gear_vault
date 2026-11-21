"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    MapPin,
    Search,
    ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Hero = () => {


    const { data: session, isPending } = authClient.useSession();

    const role = session?.user?.role;

    const listingHref = !session
        ? "/sign-up"
        : role === "Owner"
            ? "/dashboard/owner/add-equipment"
            : role === "Admin"
                ? "/dashboard/admin"
                : "/dashboard/customer";

    const listingLabel = !session
        ? "List Your Equipment"
        : role === "Owner"
            ? "Add Equipment"
            : "Go to Dashboard";


    const shouldReduceMotion = useReducedMotion();

    const animation = {
        initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true },
    };

    return (
        <section className="bg-base-200">
            <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

                {/* Hero Content */}
                <motion.div {...animation}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-semibold text-accent">
                        <ShieldCheck size={17} />
                        Trusted Equipment Rental Marketplace
                    </span>

                    <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight text-base-content sm:text-5xl lg:text-[56px]">
                        Rent professional equipment,{" "}
                        <span className="text-[#F4A300]">
                            without the cost of owning it.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-8 text-base-content/70 sm:text-lg">
                        Browse approved listings from local owners, book in
                        minutes, and pay securely for construction, photography,
                        farming, events, and more.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/equipment"
                            className="btn h-13 border-none bg-[#F4A300] px-6 text-base font-semibold text-primary-content shadow-sm hover:bg-[#E09500]"
                        >
                            Browse Equipment
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href={isPending ? "/" : listingHref}
                            onClick={(event) => {
                                if (isPending) event.preventDefault();
                            }}
                            aria-disabled={isPending}
                            className={`btn h-13 border border-secondary bg-transparent px-6 text-base font-semibold text-secondary hover:bg-secondary/10 ${isPending ? "pointer-events-none opacity-60" : ""
                                }`}
                        >
                            {listingLabel}
                        </Link>
                    </div>

                    {/* Trust Points */}
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-base-content/70">
                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={17} className="text-accent" />
                            Approved listings
                        </span>

                        <span className="flex items-center gap-2">
                            <ShieldCheck size={17} className="text-accent" />
                            Secure payments
                        </span>

                        <span className="flex items-center gap-2">
                            <CalendarDays size={17} className="text-accent" />
                            Flexible rentals
                        </span>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    {...animation}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="relative mx-auto w-full max-w-lg lg:max-w-none"
                >
                    <div
                        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-base-300 bg-cover bg-center shadow-lg"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85')",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B46]/40 via-transparent to-transparent" />
                    </div>

                    {/* Floating Info Chips */}
                    <div className="absolute -bottom-5 left-4 rounded-xl bg-base-100 px-4 py-3 shadow-lg sm:left-8">
                        <p className="text-xs text-base-content/70">
                            Equipment marketplace
                        </p>
                        <p className="mt-1 font-bold text-base-content">
                            Rent with confidence
                        </p>
                    </div>

                    <div className="absolute top-6 -right-2 rounded-xl bg-base-100 px-4 py-3 shadow-lg sm:-right-5">
                        <p className="text-xs text-base-content/70">
                            Flexible pricing
                        </p>
                        <p className="mt-1 font-bold text-accent">
                            Daily · Weekly · Monthly
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Equipment Search */}
            <div className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 pb-16 sm:px-6 lg:-mt-12 lg:px-8">
                <form
                    action="/equipment"
                    method="GET"
                    className="grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end lg:p-6"
                >
                    <div>
                        <label
                            htmlFor="search"
                            className="mb-2 block text-sm font-semibold text-base-content"
                        >
                            What do you need?
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/70"
                            />
                            <input
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Search equipment..."
                                className="input input-bordered w-full pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block text-sm font-semibold text-base-content"
                        >
                            Location
                        </label>

                        <div className="relative">
                            <MapPin
                                size={18}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-base-content/70"
                            />
                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Enter location"
                                className="input input-bordered w-full pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-semibold text-base-content"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            defaultValue=""
                            className="select select-bordered w-full"
                        >
                            <option value="">All categories</option>
                            <option value="Construction Equipment">
                                Construction Equipment
                            </option>
                            <option value="Photography Equipment">
                                Photography Equipment
                            </option>
                            <option value="Vehicles & Transportation">
                                Vehicles & Transportation
                            </option>
                            <option value="Agriculture Equipment">
                                Agriculture Equipment
                            </option>
                            <option value="Electronics">Electronics</option>
                            <option value="Event Equipment">
                                Event Equipment
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn h-12 border-none bg-[#F4A300] px-7 font-semibold text-primary-content hover:bg-[#E09500]"
                    >
                        <Search size={18} />
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Hero;