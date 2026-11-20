"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    TriangleAlert,
    Package,
    CalendarDays,
    Users,
    CreditCard,
    Hash
} from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Booking {
    _id: string;
    equipmentName: string;
    equipmentImage: string;
    rentalStartDate: string;
    rentalEndDate: string;
    quantity: number;
    totalAmount: number;
}

interface Payment {
    paymentIntentId: string;
    amount: number;
    currency: string;
}

const PaymentSuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [payment, setPayment] = useState<Payment | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const sessionId = new URLSearchParams(
                    window.location.search
                ).get("session_id");

                if (!sessionId) {
                    throw new Error("Payment session not found.");
                }

                const token = await getTokenFromClient();

                if (!token) {
                    throw new Error("Please sign in to verify your payment.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/bookings/checkout-verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ sessionId }),
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Payment verification failed."
                    );
                }

                setBooking(data.booking);
                setPayment(data.payment);

            } catch (error) {
                console.error("Payment verification error:", error);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase()
        }).format(amount);
    };

    const shortenId = (id: string) => {
        if (!id) return "N/A";

        return `${id.slice(0, 5)}…${id.slice(-4)}`;
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">

            <div className="w-full max-w-[560px] rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sm:p-8">

                {loading ? (
                    // Loading State
                    <div className="space-y-5 text-center">
                        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-base-300" />

                        <div className="space-y-3">
                            <div className="mx-auto h-6 w-52 animate-pulse rounded bg-base-300" />
                            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-base-300" />
                        </div>

                        <p className="text-sm font-medium text-base-content/70">
                            Confirming your payment…
                        </p>
                    </div>

                ) : booking && payment ? (
                    // Success State
                    <div className="text-center">

                        <div className="mx-auto mb-5 flex h-20 w-20 animate-[check-pop_0.45s_ease-out] items-center justify-center rounded-full bg-success/10">
                            <CheckCircle2
                                size={48}
                                className="text-success"
                            />
                        </div>

                        <style jsx>{`
                            @keyframes check-pop {
                                0% {
                                    transform: scale(0.5);
                                    opacity: 0;
                                }
                                100% {
                                    transform: scale(1);
                                    opacity: 1;
                                }
                            }
                        `}</style>

                        <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
                            Payment successful
                        </h1>

                        <p className="mt-2 text-sm text-base-content/60">
                            Your payment is confirmed and your booking is ready!
                        </p>

                        {/* Booking Summary */}
                        <div className="mt-8 rounded-xl border border-base-300 p-4 text-left">

                            <div className="flex items-center gap-3 border-b border-base-300 pb-4">
                                {booking.equipmentImage && (
                                    <img
                                        src={booking.equipmentImage}
                                        alt={booking.equipmentName}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                )}

                                <div>
                                    <p className="text-xs text-base-content/60">
                                        Equipment
                                    </p>
                                    <h2 className="font-semibold">
                                        {booking.equipmentName}
                                    </h2>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 text-sm">

                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-base-content/60">
                                        <CalendarDays size={16} />
                                        Rental dates
                                    </span>
                                    <span className="text-right font-medium">
                                        {formatDate(booking.rentalStartDate)}
                                        {" - "}
                                        {formatDate(booking.rentalEndDate)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-base-content/60">
                                        <Users size={16} />
                                        Quantity
                                    </span>
                                    <span className="font-medium">
                                        {booking.quantity}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-base-content/60">
                                        <CreditCard size={16} />
                                        Total paid
                                    </span>
                                    <span className="font-bold text-success">
                                        {formatAmount(
                                            payment.amount,
                                            payment.currency
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-base-content/60">
                                        <Hash size={16} />
                                        Booking ID
                                    </span>
                                    <span className="font-medium">
                                        {shortenId(booking._id)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-base-content/60">
                                        <CreditCard size={16} />
                                        Transaction ID
                                    </span>
                                    <span className="font-medium">
                                        {shortenId(payment.paymentIntentId)}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                            <Link
                                href="/dashboard/customer/rental"
                                className="btn btn-primary flex-1"
                            >
                                View My Rentals
                            </Link>

                            <Link
                                href="/equipment"
                                className="btn btn-outline flex-1"
                            >
                                Browse more equipment
                            </Link>

                        </div>
                    </div>

                ) : (
                    // Verification Error State
                    <div className="text-center">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
                            <TriangleAlert
                                size={44}
                                className="text-error"
                            />
                        </div>

                        <h1 className="text-2xl font-bold">
                            We couldn't confirm your payment
                        </h1>

                        <p className="mt-3 text-sm leading-relaxed text-base-content/60">
                            If you were charged, your booking will appear in My Rentals shortly.
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                            <Link
                                href="/dashboard/customer/rental"
                                className="btn btn-primary flex-1"
                            >
                                Check My Rentals
                            </Link>

                            <Link
                                href="/contact"
                                className="btn btn-outline flex-1"
                            >
                                Contact support
                            </Link>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentSuccessPage;