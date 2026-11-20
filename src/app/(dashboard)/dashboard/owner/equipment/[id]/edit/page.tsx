"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type Equipment = {
    name: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: string;
    availableQuantity: number;
    condition: string;
    brand: string;
    model: string;
    rentalTerms: string;
    imageUrl: string;
};

const categories = [
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
];

const inputClass = "input input-bordered w-full bg-base-100";

const EditEquipmentPage = () => {
    const { id } = useParams();
    const router = useRouter();

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const token = await getTokenFromClient();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load equipment.");
                }

                const data = await response.json();
                setEquipment(data);
            } catch (error) {
                alert(error instanceof Error ? error.message : "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [id]);

    const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const rentalPrice = Number(formData.get("rentalPrice"));
        const availableQuantity = Number(formData.get("availableQuantity"));

        if (
            rentalPrice <= 0 ||
            availableQuantity <= 0 ||
            !Number.isInteger(availableQuantity)
        ) {
            alert("Enter a valid price and quantity.");
            return;
        }

        const updatedData = {
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
            rentalTerms: formData.get("rentalTerms"),
        };

        try {
            setIsSubmitting(true);

            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update equipment.");
            }

            alert("Equipment updated successfully!");
            router.push("/dashboard/owner/equipment");
        } catch (error) {
            alert(error instanceof Error ? error.message : "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="py-12 text-center">Loading equipment...</div>;
    }

    if (!equipment) {
        return <div className="alert alert-error">Equipment not found.</div>;
    }

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-2 text-2xl font-bold">Edit Equipment</h1>
            <p className="mb-8 text-base-content/60">
                Update your equipment information.
            </p>

            <form onSubmit={handleUpdate} className="space-y-5">

                <div>
                    <label className="mb-2 block font-medium">Equipment Name</label>
                    <input
                        name="name"
                        defaultValue={equipment.name}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={equipment.description}
                        required
                        rows={4}
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block font-medium">Category</label>
                        <select
                            name="category"
                            defaultValue={equipment.category}
                            className="select select-bordered w-full"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Location</label>
                        <input
                            name="location"
                            defaultValue={equipment.location}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Rental Price</label>
                        <input
                            name="rentalPrice"
                            type="number"
                            min="1"
                            defaultValue={equipment.rentalPrice}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Rental Type</label>
                        <select
                            name="rentalType"
                            defaultValue={equipment.rentalType}
                            className="select select-bordered w-full"
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Available Quantity</label>
                        <input
                            name="availableQuantity"
                            type="number"
                            min="1"
                            defaultValue={equipment.availableQuantity}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Condition</label>
                        <select
                            name="condition"
                            defaultValue={equipment.condition}
                            className="select select-bordered w-full"
                        >
                            {["New", "Like New", "Good", "Fair", "Needs Repair"].map(
                                (condition) => (
                                    <option key={condition} value={condition}>
                                        {condition}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Brand</label>
                        <input
                            name="brand"
                            defaultValue={equipment.brand}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Model</label>
                        <input
                            name="model"
                            defaultValue={equipment.model}
                            required
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block font-medium">Current Equipment Image</label>
                    <img
                        src={equipment.imageUrl}
                        alt={equipment.name}
                        className="h-40 rounded-lg object-contain"
                    />
                    <p className="mt-2 text-xs text-base-content/60">
                        The current image will remain unchanged.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block font-medium">Rental Terms & Conditions</label>
                    <textarea
                        name="rentalTerms"
                        defaultValue={equipment.rentalTerms}
                        required
                        rows={5}
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? "Updating..." : "Save Changes"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditEquipmentPage;