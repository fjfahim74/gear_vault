"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, LoaderCircle, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type Profile = {
    name: string;
    email: string;
    image: string;
    phoneNumber: string;
    address: string;
    role: string;
    createdAt?: string;
};

const ProfileClient = () => {
    const { data: session } = authClient.useSession();

    const [profile, setProfile] = useState<Profile>({
        name: "",
        email: "",
        image: "",
        phoneNumber: "",
        address: "",
        role: "Customer"
    });

    const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = await getTokenFromClient();

                const res = await fetch(`${apiUrl}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Failed to load profile");
                }

                const data = await res.json();

                setProfile(data);
                setOriginalProfile(data);
            } catch {
                toast.error("Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [apiUrl]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await res.json();

            if (!result.success) {
                throw new Error("Image upload failed");
            }

            setProfile((prev) => ({
                ...prev,
                image: result.data.url
            }));

            toast.success("Profile image uploaded.");
        } catch {
            toast.error("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!profile.name.trim()) {
            toast.error("Name is required.");
            return;
        }

        setSaving(true);

        try {
            const token = await getTokenFromClient();

            const res = await fetch(`${apiUrl}/users/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profile.name,
                    image: profile.image,
                    phoneNumber: profile.phoneNumber,
                    address: profile.address
                })
            });

            if (!res.ok) {
                throw new Error("Profile update failed");
            }

            const { error } = await authClient.updateUser({
                name: profile.name,
                image: profile.image
            });

            if (error) {
                throw new Error("Failed to update account information");
            }

            setOriginalProfile(profile);
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Unable to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const isChanged =
        originalProfile &&
        JSON.stringify({
            name: profile.name,
            image: profile.image,
            phoneNumber: profile.phoneNumber,
            address: profile.address
        }) !== JSON.stringify({
            name: originalProfile.name,
            image: originalProfile.image,
            phoneNumber: originalProfile.phoneNumber,
            address: originalProfile.address
        });

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <LoaderCircle className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="mt-1 text-base-content/60">
                    Manage your personal information.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">

                {/* Profile Summary */}
                <div className="card h-fit border border-base-300 bg-base-100 shadow-sm lg:col-span-4">
                    <div className="card-body items-center text-center">

                        <div className="relative">
                            {profile.image ? (
                                <img
                                    src={profile.image}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full border-4 border-primary/10 object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-base-200">
                                    <UserRound size={40} className="text-base-content/50" />
                                </div>
                            )}

                            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-content shadow-md">
                                <Camera size={17} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        {uploading && (
                            <p className="text-xs text-primary">Uploading image...</p>
                        )}

                        <h2 className="mt-3 text-xl font-bold">
                            {profile.name}
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {profile.email}
                        </p>

                        <span className="badge badge-primary badge-outline mt-2">
                            {profile.role}
                        </span>
                    </div>
                </div>

                {/* Edit Profile */}
                <div className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-8">
                    <div className="card-body">
                        <h2 className="mb-2 text-lg font-bold">
                            Edit Profile
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="label font-medium">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    readOnly
                                    className="input input-bordered w-full bg-base-200"
                                />
                                <p className="mt-1 text-xs text-base-content/50">
                                    Email address cannot be changed.
                                </p>
                            </div>

                            <div>
                                <label className="label font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={profile.phoneNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label font-medium">Address</label>
                                <textarea
                                    name="address"
                                    value={profile.address || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="label font-medium">Profile Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={profile.image || ""}
                                    onChange={handleChange}
                                    placeholder="Upload an image or paste an image URL"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-base-300 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setProfile(originalProfile!)}
                                    disabled={!isChanged || saving}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={!isChanged || saving || uploading}
                                    className="btn btn-primary"
                                >
                                    {saving ? (
                                        <>
                                            <LoaderCircle size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileClient;