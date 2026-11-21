import Link from "next/link";
import {
    BadgeDollarSign,
    BadgeCheck,
    CalendarClock,
    Lock,
    ArrowRight,
} from "lucide-react";

const benefits = [
    {
        title: "Affordable Rental Prices",
        description: "Pay only for the period you need without buying expensive equipment.",
        icon: BadgeDollarSign,
    },
    {
        title: "Admin-Reviewed Listings",
        description: "Every equipment listing is reviewed before becoming available.",
        icon: BadgeCheck,
    },
    {
        title: "Flexible Rental Periods",
        description: "Choose daily, weekly, or monthly rental options.",
        icon: CalendarClock,
    },
    {
        title: "Secure Payments",
        description: "Complete your rentals through secure Stripe-powered checkout.",
        icon: Lock,
    },
];

export default function WhyChooseUs() {
    return (
        <section id="about" className="bg-base-200 py-20">
            <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:items-center">
                <div className="md:col-span-5">
                    <p className="mb-3 font-semibold text-accent">
                        WHY GEARVAULT
                    </p>

                    <h2 className="text-3xl font-bold leading-tight text-base-content md:text-4xl">
                        Rent with Confidence
                    </h2>

                    <p className="mt-5 leading-7 text-base-content/70">
                        Finding the right equipment should be simple and stress-free.
                        GearVault connects you with reviewed equipment listings, flexible
                        rental options, and secure payments—all in one place.
                    </p>

                    <Link
                        href="/equipment"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-secondary transition hover:text-accent"
                    >
                        Explore how it works
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 md:col-span-7">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <div
                                key={benefit.title}
                                className="rounded-xl border border-base-300 bg-base-100 p-6 transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary-content">
                                    <Icon size={23} />
                                </div>

                                <h3 className="mb-2 text-lg font-bold text-base-content">
                                    {benefit.title}
                                </h3>

                                <p className="text-sm leading-6 text-base-content/70">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}