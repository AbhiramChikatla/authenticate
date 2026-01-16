import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";

const Profile = () => {
    const { LoginUser, setLoginUser } = useContext(userContext);

    const isAuthed = Boolean(LoginUser && (LoginUser.username || LoginUser.email));
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        username: LoginUser?.username || "",
        bio: LoginUser?.bio || "",
    });
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (isEditing) {
            setForm({
                username: LoginUser?.username || "",
                bio: LoginUser?.bio || "",
            });
        }
    }, [isEditing, LoginUser]);

    const fields = [
        { label: "Username", value: LoginUser?.username || "Not set" },
        { label: "Email", value: LoginUser?.email || "Not set" },
        { label: "Bio", value: LoginUser?.bio || "Add a short bio" },
        {
            label: "Member Since",
            value: LoginUser?.createdAt
                ? new Date(LoginUser.createdAt).toLocaleDateString()
                : "Not available",
        },
        { label: "Account ID", value: LoginUser?._id || "Not available" },
    ];

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.username || form.username.trim().length < 3) {
            return "Username must be at least 3 characters.";
        }
        return null;
    };

    const onSave = async () => {
        const error = validate();
        if (error) {
            setStatus({ type: "error", msg: error });
            return;
        }
        setSaving(true);
        setStatus(null);
        try {
            const res = await fetch("http://localhost:3000/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: form.username.trim(),
                    bio: form.bio,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data?.msg || "Failed to update profile");
            }
            setLoginUser(data.user);
            setStatus({ type: "success", msg: "Profile updated successfully." });
            setIsEditing(false);
        } catch (e) {
            setStatus({ type: "error", msg: e.message || "Something went wrong" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                                <p className="text-gray-600">Manage your account details.</p>
                            </div>
                            {isAuthed && (
                                <button
                                    onClick={() => setIsEditing((v) => !v)}
                                    className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800"
                                >
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>
                            )}
                        </div>
                        {status && (
                            <div
                                className={`mt-4 rounded-lg px-4 py-2 text-sm ${
                                    status.type === "success"
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                            >
                                {status.msg}
                            </div>
                        )}
                    </div>

                    <div className="p-8 space-y-6">
                        {isAuthed ? (
                            <>
                                {isEditing ? (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <input
                                                name="username"
                                                value={form.username}
                                                onChange={onChange}
                                                className="w-full rounded-lg border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                                                placeholder="Your display name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={form.bio}
                                                onChange={onChange}
                                                rows={3}
                                                className="w-full rounded-lg border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                                                placeholder="Tell us a little about yourself"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={onSave}
                                                disabled={saving}
                                                className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-70"
                                            >
                                                {saving ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {fields.map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-xl px-4 py-3"
                                            >
                                                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                                                <span className="text-base text-gray-900 break-all">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-gray-700">
                                <p className="mb-4">Please log in to view your profile.</p>
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
        </div>
    );
};

export default Profile;

