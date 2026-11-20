"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type Props = {
    equipmentId: string;
};

export default function FavoriteButton({ equipmentId }: Props) {
    const { data: session, isPending } = authClient.useSession();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const role = session?.user?.role;

    // Load existing favorite status
    useEffect(() => {
        let isActive = true;

        const fetchFavorite = async () => {
            if (isPending) return;

            if (role !== "Customer") {
                setIsLoading(false);
                return;
            }

            try {
                const token = await getTokenFromClient();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load favorites.");
                }

                const favorites = await response.json();

                if (isActive) {
                    setIsFavorite(
                        favorites.some(
                            (item: { _id: string }) =>
                                item._id === equipmentId
                        )
                    );
                }
            } catch (error) {
                console.error(error);

                if (isActive) {
                    toast.error("Unable to load favorite status.");
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        fetchFavorite();

        return () => {
            isActive = false;
        };
    }, [equipmentId, isPending, role]);

    // Add or remove favorite
    const handleFavorite = async () => {
        const previousStatus = isFavorite;
        const newStatus = !previousStatus;

        setIsFavorite(newStatus);
        setIsSaving(true);

        try {
            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/favorites${previousStatus ? `/${equipmentId}` : ""
                }`,
                {
                    method: previousStatus ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    ...(previousStatus
                        ? {}
                        : {
                            body: JSON.stringify({ equipmentId }),
                        }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Favorite action failed.");
            }

            toast.success(
                newStatus
                    ? "Added to favorites!"
                    : "Removed from favorites!"
            );
        } catch (error) {
            console.error(error);

            setIsFavorite(previousStatus);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const isDisabled =
        isPending ||
        role !== "Customer" ||
        isLoading ||
        isSaving;

    return (
        <button
            type="button"
            onClick={handleFavorite}
            disabled={isDisabled}
            title={
                role !== "Customer" && !isPending
                    ? "Switch to a customer account to rent equipment."
                    : ""
            }
            aria-pressed={isFavorite}
            className={`btn w-full ${isFavorite
                ? "border-error bg-error/10 text-error hover:bg-error hover:text-white"
                : "btn-outline"
                }`}
        >
            {isSaving || isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
            ) : (
                <Heart
                    size={18}
                    className={isFavorite ? "fill-current" : ""}
                />
            )}

            {isLoading
                ? "Loading..."
                : isSaving
                    ? "Saving..."
                    : isFavorite
                        ? "Saved"
                        : "Add to Favorites"}
        </button>
    );
}