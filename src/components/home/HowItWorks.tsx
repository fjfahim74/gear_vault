import {
    Search,
    CalendarDays,
    ShieldCheck,
    PackageCheck,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Search & Compare",
        description:
            "Filter by category, location, price and availability.",
        icon: Search,
    },
    {
        number: "02",
        title: "Choose Dates",
        description:
            "Pick your rental period and quantity. See the total instantly.",
        icon: CalendarDays,
    },
    {
        number: "03",
        title: "Pay Securely",
        description:
            "Checkout through Stripe, with no card details on our site.",
        icon: ShieldCheck,
    },
    {
        number: "04",
        title: "Receive & Return",
        description:
            "Get your equipment, use it, return it and review your rental.",
        icon: PackageCheck,
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-14 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
                        Simple Process
                    </p>

                    <h2 className="text-3xl font-bold text-[#0F2B46] sm:text-4xl">
                        How GearVault Works
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        Renting equipment has never been easier. Follow
                        these four simple steps to get started.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="relative text-center"
                            >
                                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#F4A300] bg-[#0F2B46] text-xl font-bold text-white">
                                    {step.number}
                                </div>

                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                    <Icon size={28} />
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-[#0F2B46]">
                                    {step.title}
                                </h3>

                                <p className="text-sm leading-6 text-slate-600">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}