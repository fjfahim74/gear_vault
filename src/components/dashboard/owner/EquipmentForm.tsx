"use client";

import { useState, type ReactNode, type FormEvent } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type EquipmentFormProps = {
    children: ReactNode;
};

const EquipmentForm = ({ children }: EquipmentFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const imageUploadStatus = formData.get("imageUploadStatus");
        const imageUrl = formData.get("imageUrl");

        if (imageUploadStatus === "uploading") {
            toast.info("Please wait until the image upload is complete.");
            return;
        }

        if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
            toast.error("Please upload an equipment image or provide an image URL.");
            return;
        }
        const rentalPrice = Number(formData.get("price"));
        const availableQuantity = Number(formData.get("quantity"));

        if (rentalPrice <= 0 || availableQuantity <= 0) {
            toast.error("Rental price and available quantity must be greater than zero.");
            return;
        }

        if (!Number.isInteger(availableQuantity)) {
            toast.error("Available quantity must be a whole number.");
            return;
        }

        const equipmentData = {
            name: formData.get("name"),
            description: formData.get("description"),
            category: formData.get("category"),
            location: formData.get("location"),
            rentalPrice,
            rentalType: formData.get("rentalType"),
            availableQuantity,
            condition: formData.get("condition"),
            brand: formData.get("brand"),
            model: formData.get("model"),
            rentalTerms: formData.get("terms"),
            imageUrl: formData.get("imageUrl"),
        };

        try {
            setIsSubmitting(true);

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Authentication required. Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(equipmentData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add equipment.");
            }

            toast.success("Equipment submitted successfully! Waiting for admin approval.");
            router.push("/dashboard/owner/equipment");
        } catch (error) {
            console.error("Equipment submission error:", error);
            toast.error(error instanceof Error ? error.message : "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {children}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary px-8"
                >
                    {isSubmitting ? "Submitting..." : "Add Equipment"}
                </button>
            </div>
        </form>
    );
};

export default EquipmentForm;