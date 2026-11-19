import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const benefits = [
    "Free to list",
    "Admin-reviewed listings",
    "Get paid per rental",
];

export default function BecomeOwner() {
    return (
        <section className="bg-base-100 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-[#0F2B46] px-6 py-12 sm:px-10 md:px-16 md:py-16">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                            For Equipment Owners
                        </p>

                        <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                            Turn Idle Equipment Into Income
                        </h2>

                        <p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">
                            Have equipment sitting unused? List it on GearVault,
                            connect with people who need it, and earn money from
                            every successful rental.
                        </p>

                        <div className="mt-7 space-y-3">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit}
                                    className="flex items-center gap-3 text-white"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                                        <Check size={16} />
                                    </span>

                                    <span className="text-sm font-medium sm:text-base">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/sign-up"
                            className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-primary-content transition hover:brightness-95 sm:w-auto"
                        >
                            Start Listing
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}