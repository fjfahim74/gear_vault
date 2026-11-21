"use client";

import { useEffect, useMemo, useState } from "react";
import {
    X,
    Minus,
    Plus,
    CalendarDays,
    Phone,
    MapPin,
    FileText,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type Equipment = {
    _id: string;
    name: string;
    imageUrl: string;
    rentalPrice: number;
    rentalType: "Daily" | "Weekly" | "Monthly";
    availableQuantity: number;
};

type Props = {
    equipment: Equipment;
    onClose: () => void;
};

type Availability = {
    isAvailable: boolean;
    availableQuantity: number;
    requestedQuantity: number;
    message: string;
};

function getToday() {
    const today = new Date();

    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function addOneDay(date: string) {
    const nextDate = new Date(`${date}T00:00:00`);
    nextDate.setDate(nextDate.getDate() + 1);

    return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;
}

export default function BookingModal({ equipment, onClose }: Props) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [contactNumber, setContactNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const [availability, setAvailability] = useState<Availability | null>(null);
    const [availabilityStatus, setAvailabilityStatus] = useState<
        "idle" | "checking" | "available" | "unavailable" | "error"
    >("idle");

    // Calculate rental duration and total price
    const { days, durationUnits, totalAmount } = useMemo(() => {
        if (!startDate || !endDate || endDate < startDate) {
            return {
                days: 0,
                durationUnits: 0,
                totalAmount: 0,
            };
        }

        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        const rentalDays =
            Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

        let units = rentalDays;

        if (equipment.rentalType === "Weekly") {
            units = Math.ceil(rentalDays / 7);
        }

        if (equipment.rentalType === "Monthly") {
            units = Math.ceil(rentalDays / 30);
        }

        return {
            days: rentalDays,
            durationUnits: units,
            totalAmount: equipment.rentalPrice * units * quantity,
        };
    }, [startDate, endDate, quantity, equipment]);

    // Check equipment availability
    useEffect(() => {
        if (!startDate || !endDate || endDate < startDate) {
            setAvailability(null);
            setAvailabilityStatus("idle");
            return;
        }

        let isActive = true;

        const timer = setTimeout(async () => {
            try {
                setAvailabilityStatus("checking");
                setAvailability(null);

                const token = await getTokenFromClient();

                const params = new URLSearchParams({
                    equipmentId: equipment._id,
                    startDate,
                    endDate,
                    quantity: "1",
                });

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/bookings/availability?${params}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to check availability.");
                }

                const data: Availability = await response.json();

                if (isActive) {
                    setAvailability(data);
                    setAvailabilityStatus(
                        data.availableQuantity > 0 ? "available" : "unavailable"
                    );
                }
            } catch (error) {
                console.error(error);

                if (isActive) {
                    setAvailabilityStatus("error");
                }
            }
        }, 400);

        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [equipment._id, startDate, endDate]);

    // Close modal with Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    });

    const hasFormData =
        startDate ||
        endDate ||
        contactNumber ||
        deliveryAddress ||
        additionalNotes;

    const handleClose = () => {
        if (hasFormData && !window.confirm("Discard your booking details?")) {
            return;
        }

        onClose();
    };

    const handleStartDate = (value: string) => {
        setStartDate(value);

        if (!endDate || endDate < value) {
            setEndDate(addOneDay(value));
        }
    };

    const isFormValid =
        startDate &&
        endDate &&
        endDate >= startDate &&
        contactNumber.trim() &&
        deliveryAddress.trim() &&
        /^\+?[0-9\s-]{7,20}$/.test(contactNumber.trim());

    const canContinue =
        isFormValid &&
        availabilityStatus === "available" &&
        availability &&
        quantity <= availability.availableQuantity;

    const handlePayment = async () => {
        try {
            setIsSubmitting(true);
            setPaymentError("");

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in to continue.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bookings/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        equipmentId: equipment._id,
                        startDate,
                        endDate,
                        quantity,
                        contactNumber,
                        deliveryAddress,
                        additionalNotes,
                    }),
                }
            );

            const data = await response.json();

            console.log("Checkout API response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Unable to start payment.");
            }

            if (!data.data?.redirectUrl) {
                throw new Error("Stripe checkout URL was not received.");
            }

            window.location.href = data.data.redirectUrl;

        } catch (error) {
            console.error("Payment error:", error);

            setPaymentError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="modal modal-open z-50 bg-neutral/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-base-100 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 px-5 py-4 sm:px-8">
                    <div>
                        <h2
                            id="booking-title"
                            className="text-xl font-bold text-base-content"
                        >
                            Book Equipment
                        </h2>

                        <p className="mt-1 text-sm text-base-content/60">
                            {equipment.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn btn-circle btn-ghost btn-sm"
                        aria-label="Close booking modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="grid flex-1 overflow-y-auto lg:grid-cols-5">

                    {/* Booking Form */}
                    <div className="space-y-6 p-5 sm:p-8 lg:col-span-3">

                        {/* Rental Period */}
                        <section>
                            <h3 className="mb-4 font-semibold text-base-content">
                                Rental Period
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="form-control">
                                    <span className="label-text mb-2">
                                        Start Date *
                                    </span>

                                    <input
                                        type="date"
                                        min={getToday()}
                                        value={startDate}
                                        onChange={(event) =>
                                            handleStartDate(event.target.value)
                                        }
                                        className="input input-bordered w-full"
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text mb-2">
                                        End Date *
                                    </span>

                                    <input
                                        type="date"
                                        min={startDate || getToday()}
                                        value={endDate}
                                        onChange={(event) =>
                                            setEndDate(event.target.value)
                                        }
                                        className="input input-bordered w-full"
                                    />
                                </label>
                            </div>

                            {/* Availability Feedback */}
                            {availabilityStatus !== "idle" && (
                                <div className="mt-4">
                                    {availabilityStatus === "checking" && (
                                        <p className="flex items-center gap-2 text-sm text-base-content/60">
                                            <span className="loading loading-spinner loading-xs" />
                                            Checking availability...
                                        </p>
                                    )}

                                    {availabilityStatus === "available" && (
                                        <p className="flex items-center gap-2 text-sm font-medium text-success">
                                            <CheckCircle2 size={18} />
                                            {availability?.availableQuantity} units available for these dates.
                                        </p>
                                    )}

                                    {availabilityStatus === "unavailable" && (
                                        <p className="flex items-center gap-2 text-sm font-medium text-error">
                                            <AlertCircle size={18} />
                                            {availability?.message}
                                        </p>
                                    )}

                                    {availabilityStatus === "error" && (
                                        <p className="flex items-center gap-2 text-sm text-error">
                                            <AlertCircle size={18} />
                                            Unable to check availability. Please try again.
                                        </p>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Quantity */}
                        <section>
                            <h3 className="mb-3 font-semibold text-base-content">
                                Required Quantity
                            </h3>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    disabled={quantity <= 1}
                                    onClick={() =>
                                        setQuantity((previous) => previous - 1)
                                    }
                                    className="btn btn-square btn-outline"
                                >
                                    <Minus size={18} />
                                </button>

                                <span className="min-w-8 text-center text-lg font-bold">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        startDate && endDate
                                            ? availabilityStatus !== "available" ||
                                            quantity >= (availability?.availableQuantity ?? 0)
                                            : quantity >= equipment.availableQuantity
                                    }
                                    onClick={() =>
                                        setQuantity((previous) => previous + 1)
                                    }
                                    className="btn btn-square btn-outline"
                                >
                                    <Plus size={18} />
                                </button>

                                <span className="text-sm text-base-content/60">
                                    {startDate && endDate
                                        ? availabilityStatus === "available"
                                            ? `Max ${availability?.availableQuantity} units for these dates`
                                            : availabilityStatus === "checking"
                                                ? "Checking availability..."
                                                : "Date availability not confirmed"
                                        : `Total inventory: ${equipment.availableQuantity} units`}
                                </span>
                            </div>

                            {availabilityStatus === "available" &&
                                availability &&
                                quantity > availability.availableQuantity && (
                                    <p className="mt-2 text-sm text-error">
                                        Only {availability.availableQuantity} units are available.
                                        Please reduce the quantity to continue.
                                    </p>
                                )}
                        </section>

                        {/* Contact Number */}
                        <label className="form-control">
                            <span className="label-text mb-2 flex items-center gap-2">
                                <Phone size={16} />
                                Contact Number *
                            </span>

                            <input
                                type="tel"
                                value={contactNumber}
                                onChange={(event) =>
                                    setContactNumber(event.target.value)
                                }
                                placeholder="+880 1XXXXXXXXX"
                                className="input input-bordered w-full"
                            />

                            {contactNumber &&
                                !/^\+?[0-9\s-]{7,20}$/.test(contactNumber.trim()) && (
                                    <span className="mt-1 text-xs text-error">
                                        Please enter a valid contact number.
                                    </span>
                                )}
                        </label>

                        {/* Delivery Address */}
                        <label className="form-control">
                            <span className="label-text mb-2 flex items-center gap-2">
                                <MapPin size={16} />
                                Delivery Address *
                            </span>

                            <textarea
                                value={deliveryAddress}
                                onChange={(event) =>
                                    setDeliveryAddress(event.target.value)
                                }
                                placeholder="Enter your complete delivery address"
                                rows={3}
                                className="textarea textarea-bordered w-full"
                            />
                        </label>

                        {/* Additional Notes */}
                        <label className="form-control">
                            <span className="label-text mb-2 flex items-center gap-2">
                                <FileText size={16} />
                                Additional Notes (Optional)
                            </span>

                            <textarea
                                value={additionalNotes}
                                onChange={(event) =>
                                    setAdditionalNotes(event.target.value.slice(0, 300))
                                }
                                placeholder="Any additional information..."
                                rows={2}
                                maxLength={300}
                                className="textarea textarea-bordered w-full"
                            />

                            <span className="mt-1 text-right text-xs text-base-content/50">
                                {additionalNotes.length}/300
                            </span>
                        </label>
                    </div>

                    {/* Order Summary */}
                    <aside className="flex flex-col justify-between bg-base-200 p-5 sm:p-8 lg:col-span-2">
                        <div>
                            <h3 className="mb-5 font-bold text-base-content">
                                Order Summary
                            </h3>

                            <div className="flex items-center gap-3">
                                {equipment.imageUrl && (
                                    <img
                                        src={equipment.imageUrl}
                                        alt={equipment.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                )}

                                <div>
                                    <p className="font-semibold text-base-content">
                                        {equipment.name}
                                    </p>

                                    <p className="text-sm text-base-content/60">
                                        ${equipment.rentalPrice} / {equipment.rentalType.toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4 border-t border-base-300 pt-5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-base-content/60">
                                        Duration
                                    </span>

                                    <span className="font-medium">
                                        {days > 0 ? `${days} days` : "—"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-base-content/60">
                                        Billable Units
                                    </span>

                                    <span className="font-medium">
                                        {durationUnits || "—"} {equipment.rentalType.toLowerCase()}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-base-content/60">
                                        Quantity
                                    </span>

                                    <span className="font-medium">
                                        × {quantity}
                                    </span>
                                </div>

                                <div className="border-t border-base-300 pt-4">
                                    <p className="text-xs text-base-content/60">
                                        ${equipment.rentalPrice} × {durationUnits || 0} × {quantity}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="font-semibold text-base-content">
                                            Total Amount
                                        </span>

                                        <span className="text-2xl font-bold text-primary">
                                            ${totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="mb-5 flex items-center gap-2 text-sm text-base-content/60">
                                <ShieldCheck size={18} />
                                Secure payment powered by Stripe
                            </div>

                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={!canContinue || isSubmitting}
                                className="btn btn-primary w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Redirecting to Stripe...
                                    </>
                                ) : (
                                    "Continue to Payment"
                                )}
                            </button>

                            {paymentError && (
                                <p className="mt-3 text-center text-sm text-error">
                                    {paymentError}
                                </p>
                            )}

                            <p className="mt-3 text-center text-xs text-base-content/50">
                                You will be redirected to Stripe's secure checkout page.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}