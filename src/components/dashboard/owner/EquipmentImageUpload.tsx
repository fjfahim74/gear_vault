"use client";

import { useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";

const EquipmentImageUpload = () => {
    const [imagePreview, setImagePreview] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setImageUrl("");
        setImagePreview(URL.createObjectURL(file));
        setIsUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        const imgbbAPI = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;

        try {
            const res = await fetch(imgbbAPI, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error("Image upload failed.");
            }

            setImageUrl(result.data.url);
        } catch (error) {
            console.log(error);
            alert("Failed to upload image. Please try again.");
            setImagePreview("");
            setImageUrl("");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;

        setImageUrl(url);
        setImagePreview(url);
    };

    const clearImage = () => {
        setImagePreview("");
        setImageUrl("");
    };

    return (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-200/50 px-5 py-10 text-center">

            {imagePreview ? (
                <div className="relative mb-4">
                    <img
                        src={imagePreview}
                        alt="Equipment Preview"
                        onError={() => setImagePreview("")}
                        className="h-48 w-full rounded-lg object-contain"
                    />

                    <button
                        type="button"
                        onClick={clearImage}
                        className="btn btn-circle btn-sm btn-error absolute -right-2 -top-2"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <ImagePlus size={40} className="mb-3 text-primary" />
            )}

            <label className="btn btn-outline btn-primary">
                Choose Equipment Image

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                />
            </label>

            <div className="divider my-4">OR</div>

            <input
                type="url"
                placeholder="Paste image URL here"
                value={imageUrl}
                onChange={handleUrlChange}
                disabled={isUploading}
                className="input input-bordered w-full max-w-md"
            />

            <p className="mt-3 text-sm text-base-content/50">
                {isUploading
                    ? "Uploading image..."
                    : imageUrl
                        ? "Image selected successfully."
                        : "Upload an image or paste an image URL."}
            </p>

            <input
                type="hidden"
                name="imageUrl"
                value={imageUrl}
                readOnly
            />

            <input
                type="hidden"
                name="imageUploadStatus"
                value={isUploading ? "uploading" : imageUrl ? "uploaded" : "empty"}
                readOnly
            />
        </div>
    );
};

export default EquipmentImageUpload;