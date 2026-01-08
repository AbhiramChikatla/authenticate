import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";

const Profile = () => {
    const { LoginUser } = useContext(userContext);

    const fields = [
        { label: "Username", value: LoginUser?.username || "Not set" },
        { label: "Email", value: LoginUser?.email || "Not set" },
        {
            label: "Member Since",
            value: LoginUser?.createdAt
                ? new Date(LoginUser.createdAt).toLocaleDateString()
                : "Not available",
        },
        { label: "Account ID", value: LoginUser?._id || "Not available" },
    ];

    const isAuthed = Boolean(
        LoginUser && (LoginUser.username || LoginUser.email)
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Profile
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your basic account details.
                    </p>

                    {isAuthed ? (
                        <div className="space-y-4">
                            {fields.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-xl px-4 py-3"
                                >
                                    <span className="text-sm font-medium text-gray-600">
                                        {item.label}
                                    </span>
                                    <span className="text-base text-gray-900 break-all">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-700">
                            <p className="mb-4">
                                Please log in to view your profile.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
