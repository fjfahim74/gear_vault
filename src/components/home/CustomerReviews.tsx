import { Star } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const reviews = [
    {
        name: "Daniel Carter",
        role: "Construction Contractor",
        rating: 5,
        comment:
            "GearVault made it easy to find reliable construction equipment for my project. The rental process was smooth, and the pricing was reasonable.",
        initial: "D",
    },
    {
        name: "Sophia Williams",
        role: "Professional Photographer",
        rating: 5,
        comment:
            "I rented a camera lens for a weekend shoot. The equipment was in excellent condition, and the whole experience was hassle-free.",
        initial: "S",
    },
    {
        name: "Michael Brown",
        role: "Event Organizer",
        rating: 4,
        comment:
            "A convenient platform for finding event equipment without having to purchase everything. I would definitely use it again.",
        initial: "M",
    },
    {
        name: "Olivia Martinez",
        role: "Small Business Owner",
        rating: 5,
        comment:
            "The flexible rental options helped me get the equipment I needed within my budget. Highly recommended!",
        initial: "O",
    },
];

export default function CustomerReviews() {
    return (
        <section className="bg-base-100 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="What Our Customers Say"
                    subtitle="Real experiences that show how GearVault makes equipment rental easier."
                />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {reviews.map((review) => (
                        <div
                            key={review.name}
                            className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="mb-4 flex gap-1 text-amber-500">
                                {Array.from({ length: review.rating }).map(
                                    (_, index) => (
                                        <Star
                                            key={index}
                                            size={17}
                                            fill="currentColor"
                                        />
                                    )
                                )}
                            </div>

                            <p className="min-h-28 text-sm leading-6 text-base-content/70">
                                "{review.comment}"
                            </p>

                            <div className="mt-6 flex items-center gap-3 border-t border-base-300 pt-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                                    {review.initial}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-base-content">
                                        {review.name}
                                    </h3>
                                    <p className="text-xs text-base-content/60">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}