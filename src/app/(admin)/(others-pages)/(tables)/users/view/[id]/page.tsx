"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserById } from "@/services/authService";
import { FaUserEdit } from "react-icons/fa";

export default function UserViewPage() {

    const params = useParams();
    // const id = params.id;
    const id = params.id as string;

    const [user, setUser] = useState<any>(null);

    useEffect(() => {

        const loadUser = async () => {

            const res = await fetchUserById(id);

            setUser(res.user || res);

        };

        loadUser();

    }, [id]);

    if (!user) return <p className="p-6">Loading...</p>;

    return (

        <div className="p-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-semibold text-gray-800">
                    User Profile
                </h1>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    <FaUserEdit />
                    Edit User
                </button>

            </div>

            {/* Profile Card */}
            <div className="bg-white shadow rounded-xl p-6 mb-6 flex items-center gap-6">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.charAt(0)}
                </div>

                {/* Basic Info */}
                <div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        {user.name}
                    </h2>

                    <p className="text-gray-500">
                        {user.email}
                    </p>

                    <div className="flex gap-3 mt-2">

                        {/* Role Badge */}
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {user.role?.name}
                        </span>

                        {/* Status Badge */}
                        <span
                            className={`px-3 py-1 text-xs rounded-full ${user.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.is_active ? "Active" : "Inactive"}
                        </span>

                    </div>

                </div>

            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Account Info */}
                <div className="bg-white shadow rounded-xl p-6">

                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                        Account Information
                    </h3>
                    <div className="space-y-3 text-sm">
                        <p>
                            <span className="font-medium text-gray-600">
                                Username:
                            </span>{" "}
                            {user.username}
                        </p>
                        <p>
                            <span className="font-medium text-gray-600">
                                Phone:
                            </span>{" "}
                            {user.phone_number}
                        </p>
                        <p>
                            <span className="font-medium text-gray-600">
                                Email Verified:
                            </span>{" "}
                            {user.isEmailVerified ? "Yes" : "No"}
                        </p>
                    </div>
                </div>
                {/* System Info */}
                <div className="bg-white shadow rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                        System Information
                    </h3>
                    <div className="space-y-3 text-sm">
                        <p>
                            <span className="font-medium text-gray-600">
                                User ID:
                            </span>{" "}
                            {user.id}
                        </p>
                        <p>
                            <span className="font-medium text-gray-600">
                                Created At:
                            </span>{" "}
                            {new Date(user.createdAt).toLocaleString()}
                        </p>
                        <p>
                            <span className="font-medium text-gray-600">
                                Last Updated:
                            </span>{" "}
                            {new Date(user.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}