import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Trash2, UserPlus, Shield } from "lucide-react";

const Admin = () => {
    const { LoginUser } = useContext(userContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState("users");
    const [loading, setLoading] = useState(true);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
    });

    useEffect(() => {
        // Check if user is admin
        if (LoginUser && !LoginUser.isAdmin) {
            navigate("/");
        }
        if (!LoginUser) {
            navigate("/login");
        }
    }, [LoginUser, navigate]);

    useEffect(() => {
        if (LoginUser?.isAdmin) {
            fetchData();
        }
    }, [LoginUser]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch users
            const usersRes = await fetch("http://localhost:3000/admin/users", {
                credentials: "include",
            });
            const usersData = await usersRes.json();
            if (usersData.success) {
                setUsers(usersData.users);
            }

            // Fetch blogs
            const blogsRes = await fetch("http://localhost:3000/admin/blogs", {
                credentials: "include",
            });
            const blogsData = await blogsRes.json();
            if (blogsData.success) {
                setBlogs(blogsData.blogs);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (
            !confirm(
                "Are you sure you want to delete this user? This will also delete all their blogs."
            )
        ) {
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:3000/admin/users/${userId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (data.success) {
                alert("User deleted successfully");
                fetchData();
            } else {
                alert(data.msg || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (!confirm("Are you sure you want to delete this blog?")) {
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:3000/admin/blogs/${blogId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (data.success) {
                alert("Blog deleted successfully");
                fetchData();
            } else {
                alert(data.msg || "Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            if (data.success) {
                alert("User created successfully");
                setShowAddUserModal(false);
                setNewUser({
                    username: "",
                    email: "",
                    password: "",
                    isAdmin: false,
                });
                fetchData();
            } else {
                alert(data.msg || "Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user");
        }
    };

    if (!LoginUser?.isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="text-blue-600" />
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage users and content
                            </p>
                        </div>
                        {activeTab === "users" && (
                            <button
                                onClick={() => setShowAddUserModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                <UserPlus size={20} />
                                Add User
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`${
                                activeTab === "users"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                        >
                            <Users size={20} />
                            Users ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("blogs")}
                            className={`${
                                activeTab === "blogs"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                        >
                            <FileText size={20} />
                            Blogs ({blogs.length})
                        </button>
                    </nav>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Users Tab */}
                        {activeTab === "users" && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.username}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.isAdmin ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                            User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user._id
                                                            )
                                                        }
                                                        disabled={
                                                            user._id ===
                                                            LoginUser._id
                                                        }
                                                        className={`text-red-600 hover:text-red-900 flex items-center gap-1 ml-auto ${
                                                            user._id ===
                                                            LoginUser._id
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No users found
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Blogs Tab */}
                        {activeTab === "blogs" && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Author
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {blogs.map((blog) => (
                                            <tr key={blog._id}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {blog.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-md">
                                                        {blog.excerpt}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {blog.author.username}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {blog.author.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        blog.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteBlog(
                                                                blog._id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 flex items-center gap-1 ml-auto"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {blogs.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        No blogs found
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold mb-6">
                            Add New User
                        </h2>
                        <form onSubmit={handleAddUser}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            username: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newUser.isAdmin}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                isAdmin: e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Make this user an admin
                                    </span>
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddUserModal(false);
                                        setNewUser({
                                            username: "",
                                            email: "",
                                            password: "",
                                            isAdmin: false,
                                        });
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
