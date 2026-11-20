"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, TriangleAlert } from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export default function PaymentCancelPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(
        "Releasing your booking reservation..."
    );
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const cancelCheckout = async () => {
            try {
                const holdId = new URLSearchParams(
                    window.location.search
                ).get("hold_id");

                if (!holdId) {
                    throw new Error("Booking information not found.");
                }

                const token = await getTokenFromClient();

                if (!token) {
                    throw new Error("Please sign in to release your reservation.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/bookings/cancel-checkout`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ holdId }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to cancel checkout."
                    );
                }

                if (data.paymentCompleted && data.sessionId) {
                    window.location.href =
                        `/payment/success?session_id=${data.sessionId}`;
                    return;
                }

                setMessage(
                    data.message || "Your booking reservation has been released."
                );

            } catch (error) {
                console.error("Checkout cancellation error:", error);

                setIsError(true);
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        cancelCheckout();
    }, []);

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-[500px] rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-lg">

                {loading ? (
                    <span className="loading loading-spinner loading-lg text-primary" />
                ) : isError ? (
                    <TriangleAlert
                        size={56}
                        className="mx-auto text-error"
                    />
                ) : (
                    <XCircle
                        size={56}
                        className="mx-auto text-warning"
                    />
                )}

                <h1 className="mt-5 text-2xl font-bold">
                    {loading
                        ? "Processing cancellation..."
                        : isError
                            ? "Cancellation issue"
                            : "Payment cancelled"}
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                    {message}
                </p>

                {!loading && (
                    <Link
                        href="/equipment"
                        className="btn btn-primary mt-7 w-full"
                    >
                        Browse Equipment
                    </Link>
                )}
            </div>
        </div>
    );
}