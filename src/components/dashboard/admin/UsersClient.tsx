"use client";

import { useEffect, useState } from "react";
import { Search, Users, Trash2, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: "Customer" | "Owner" | "Admin";
    createdAt: string;
}

type UsersClientProps = {
    currentUserId: string;
};

const UsersClient = ({ currentUserId }: UsersClientProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<User["role"]>("Customer");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getTokenFromClient();

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load users.");
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const searchMatch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        const roleMatch =
            roleFilter === "All" || user.role === roleFilter;

        return searchMatch && roleMatch;
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getRoleStyle = (role: User["role"]) => {
        if (role === "Admin") return "text-primary";
        if (role === "Owner") return "text-info";
        return "text-base-content/70";
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);

            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}/role`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        role: selectedRole
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update role.");
            }

            setUsers(prev =>
                prev.map(user =>
                    user._id === selectedUser._id
                        ? { ...user, role: selectedRole }
                        : user
                )
            );

            toast.success("User role updated successfully.");
            setSelectedUser(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);

            const token = await getTokenFromClient();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete user.");
            }

            setUsers(prev =>
                prev.filter(user => user._id !== selectedUser._id)
            );

            toast.success("User deleted successfully.");
            setSelectedUser(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <section className="space-y-6">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">
                        All Users
                    </h1>
                    <p className="mt-1 text-sm text-base-content/60">
                        Manage registered users and their platform roles.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                    <Users className="text-primary" size={20} />
                    <div>
                        <p className="text-xs text-base-content/50">
                            Total Users
                        </p>
                        <p className="font-bold">{users.length}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-4 sm:flex-row">
                <label className="input input-bordered flex flex-1 items-center gap-2">
                    <Search size={18} className="text-base-content/50" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </label>

                <select
                    className="select select-bordered w-full sm:w-48"
                    value={roleFilter}
                    onChange={event => setRoleFilter(event.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="Customer">Customer</option>
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                </select>

                <button
                    onClick={fetchUsers}
                    className="btn btn-outline"
                    disabled={loading}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-3 text-sm text-base-content/60">
                        Loading users...
                    </p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-error/30 bg-base-100 p-8 text-center">
                    <p className="text-error">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="btn btn-primary btn-sm mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="rounded-xl border border-base-300 bg-base-100 py-16 text-center">
                    <Users size={40} className="mx-auto text-base-content/30" />
                    <h2 className="mt-3 font-semibold">No users found</h2>
                    <p className="mt-1 text-sm text-base-content/50">
                        Try changing your search or role filter.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto rounded-xl border border-base-300 bg-base-100 md:block">
                        <table className="table">
                            <thead>
                                <tr className="bg-base-200/60 text-base-content/70">
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Registration Date</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map(user => {
                                    const isCurrentUser =
                                        user._id === currentUserId;

                                    return (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-base-200">
                                                            {user.image && !user.image.includes("unsplash.com/photos/") ? (
                                                                <img
                                                                    src={user.image}
                                                                    alt={user.name}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                                                                    {user.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            {user.name}
                                                        </p>
                                                        {isCurrentUser && (
                                                            <span className="badge badge-sm badge-outline">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-sm">
                                                {user.email}
                                            </td>

                                            <td>
                                                <span className={`text-sm font-medium ${getRoleStyle(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="text-sm text-base-content/70">
                                                {formatDate(user.createdAt)}
                                            </td>

                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline btn-primary"
                                                        disabled={isCurrentUser}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setSelectedRole(user.role);
                                                        }}
                                                        title="Change role"
                                                    >
                                                        <ShieldCheck size={15} />
                                                        Change Role
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-ghost text-error"
                                                        disabled={isCurrentUser}
                                                        onClick={() => setSelectedUser(user)}
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    {!isCurrentUser && (
                                                        <button
                                                            className="hidden"
                                                            onClick={() => setSelectedUser(user)}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-3 md:hidden">
                        {filteredUsers.map(user => {
                            const isCurrentUser =
                                user._id === currentUserId;

                            return (
                                <div
                                    key={user._id}
                                    className="rounded-xl border border-base-300 bg-base-100 p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-base-200">
                                            {user.image && !user.image.includes("unsplash.com/photos/") ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {user.name}
                                                </h3>
                                                {isCurrentUser && (
                                                    <span className="badge badge-sm badge-outline">
                                                        You
                                                    </span>
                                                )}
                                            </div>

                                            <p className="break-all text-sm text-base-content/60">
                                                {user.email}
                                            </p>

                                            <span className={`text-sm font-medium ${getRoleStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-3">
                                        <span className="text-xs text-base-content/50">
                                            Joined {formatDate(user.createdAt)}
                                        </span>

                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs btn-outline btn-primary"
                                                disabled={isCurrentUser}
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setSelectedRole(user.role);
                                                }}
                                            >
                                                Change Role
                                            </button>

                                            <button
                                                className="btn btn-xs btn-ghost text-error"
                                                disabled={isCurrentUser}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Confirmation Dialog */}
            {selectedUser && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="text-lg font-bold">
                            Manage User
                        </h3>

                        <p className="mt-2 text-sm text-base-content/60">
                            {selectedUser.name} ({selectedUser.email})
                        </p>

                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Change Role
                                    </span>
                                </label>

                                <select
                                    className="select select-bordered w-full"
                                    value={selectedRole}
                                    onChange={event =>
                                        setSelectedRole(event.target.value as User["role"])
                                    }
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Owner">Owner</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-action flex-wrap">
                            <button
                                className="btn btn-ghost"
                                disabled={actionLoading}
                                onClick={() => setSelectedUser(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                disabled={actionLoading || selectedRole === selectedUser.role}
                                onClick={handleRoleUpdate}
                            >
                                {actionLoading ? "Updating..." : "Confirm Role"}
                            </button>

                            <button
                                className="btn btn-error"
                                disabled={actionLoading}
                                onClick={handleDeleteUser}
                            >
                                {actionLoading ? "Please wait..." : "Delete User"}
                            </button>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            if (!actionLoading) setSelectedUser(null);
                        }}
                    />
                </div>
            )}
        </section>
    );
};

export default UsersClient;