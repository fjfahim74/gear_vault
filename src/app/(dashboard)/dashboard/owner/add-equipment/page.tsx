import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PackagePlus, Info } from "lucide-react";
import EquipmentForm from "@/components/dashboard/owner/EquipmentForm";
import EquipmentImageUpload from "@/components/dashboard/owner/EquipmentImageUpload";

const categories = [
    "Construction Equipment",
    "Photography Equipment",
    "Vehicles & Transportation",
    "Agriculture Equipment",
    "Electronics",
    "Event Equipment",
];

const inputClass =
    "input input-bordered w-full bg-base-100";

const labelClass =
    "mb-2 block text-sm font-medium text-base-content/80";

const AddEquipmentPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role ?? "Customer";

    if (role !== "Owner") {
        redirect(`/dashboard/${role.toLowerCase()}`);
    }

    return (
        <div className="mx-auto max-w-5xl">

            {/* Page Heading */}
            <div className="mb-8">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <PackagePlus size={25} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
                            Add New Equipment
                        </h1>

                        <p className="mt-1 text-sm text-base-content/60">
                            List your equipment and make it available for rent.
                        </p>
                    </div>
                </div>
            </div>

            <EquipmentForm>

                {/* Basic Information */}
                <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
                    <h2 className="mb-6 text-lg font-bold">
                        Basic Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">

                        <div className="sm:col-span-2">
                            <label htmlFor="name" className={labelClass}>
                                Equipment Name *
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter equipment name"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="description" className={labelClass}>
                                Description *
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Describe your equipment..."
                                required
                                className="textarea textarea-bordered w-full bg-base-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className={labelClass}>
                                Category *
                            </label>

                            <select
                                id="category"
                                name="category"
                                defaultValue=""
                                required
                                className="select select-bordered w-full bg-base-100"
                            >
                                <option value="" disabled>
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="location" className={labelClass}>
                                Location *
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Enter equipment location"
                                required
                                className={inputClass}
                            />
                        </div>

                    </div>
                </section>

                {/* Rental Information */}
                <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
                    <h2 className="mb-6 text-lg font-bold">
                        Rental Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <label htmlFor="price" className={labelClass}>
                                Rental Price *
                            </label>

                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="1"
                                placeholder="Enter rental price"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="rentalType" className={labelClass}>
                                Rental Type *
                            </label>

                            <select
                                id="rentalType"
                                name="rentalType"
                                defaultValue=""
                                required
                                className="select select-bordered w-full bg-base-100"
                            >
                                <option value="" disabled>
                                    Select rental type
                                </option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="quantity" className={labelClass}>
                                Available Quantity *
                            </label>

                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                placeholder="Enter available quantity"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="condition" className={labelClass}>
                                Equipment Condition *
                            </label>

                            <select
                                id="condition"
                                name="condition"
                                defaultValue=""
                                required
                                className="select select-bordered w-full bg-base-100"
                            >
                                <option value="" disabled>
                                    Select condition
                                </option>
                                <option value="New">New</option>
                                <option value="Like New">Like New</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Needs Repair">Needs Repair</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="brand" className={labelClass}>
                                Brand *
                            </label>

                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                placeholder="Enter brand name"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="model" className={labelClass}>
                                Model *
                            </label>

                            <input
                                id="model"
                                name="model"
                                type="text"
                                placeholder="Enter model"
                                required
                                className={inputClass}
                            />
                        </div>

                    </div>
                </section>

                {/* Equipment Image */}
                <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
                    <h2 className="mb-2 text-lg font-bold">
                        Equipment Image
                    </h2>

                    <p className="mb-5 text-sm text-base-content/60">
                        Upload a clear image of your equipment.
                    </p>

                    <EquipmentImageUpload />
                </section>

                {/* Rental Terms */}
                <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
                    <h2 className="mb-6 text-lg font-bold">
                        Rental Terms & Conditions
                    </h2>

                    <label htmlFor="terms" className={labelClass}>
                        Terms and Conditions *
                    </label>

                    <textarea
                        id="terms"
                        name="terms"
                        rows={5}
                        placeholder="Write your rental terms and conditions..."
                        required
                        className="textarea textarea-bordered w-full bg-base-100"
                    />
                </section>

                {/* Owner Information */}
                <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7">
                    <h2 className="mb-6 text-lg font-bold">
                        Owner Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <label className={labelClass}>
                                Owner Name
                            </label>

                            <input
                                type="text"
                                value={session.user.name || ""}
                                readOnly
                                className={`${inputClass} opacity-70`}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Owner Email
                            </label>

                            <input
                                type="email"
                                value={session.user.email || ""}
                                readOnly
                                className={`${inputClass} opacity-70`}
                            />
                        </div>

                    </div>
                </section>

                {/* Status Information */}
                <div className="flex flex-col gap-4 rounded-xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center">
                    <Info size={22} className="shrink-0 text-warning" />

                    <div>
                        <p className="font-semibold">
                            Listing Status:{" "}
                            <span className="badge badge-warning">
                                Pending
                            </span>
                        </p>

                        <p className="mt-1 text-sm text-base-content/60">
                            Your equipment will be submitted for admin approval.
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary px-8"
                    >
                        Add Equipment
                    </button>
                </div>

                <p className="text-right text-xs text-base-content/50">
                    Form submission will be connected in the next step.
                </p>

            </EquipmentForm>
        </div>
    );
};

export default AddEquipmentPage;