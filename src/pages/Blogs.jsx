import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";

const Blogs = () => {
    const { LoginUser } = useContext(userContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // "all" or "mine"

    useEffect(() => {
        fetchBlogs();
    }, [filter, LoginUser]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const url =
                filter === "mine" && LoginUser?._id
                    ? `http://localhost:3000/blogs?userId=${LoginUser._id}`
                    : "http://localhost:3000/blogs";
            const res = await fetch(url, {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
        } finally {
            setLoading(false);
        }
    };

    const isAuthed = Boolean(LoginUser && LoginUser.username);

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Blogs
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Discover and share stories
                        </p>
                    </div>
                    {isAuthed && (
                        <Link
                            to="/blogs/create"
                            className="bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition"
                        >
                            Create Blog
                        </Link>
                    )}
                </div>

                {isAuthed && (
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                filter === "all"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            All Blogs
                        </button>
                        <button
                            onClick={() => setFilter("mine")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                filter === "mine"
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            My Blogs
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading blogs...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                        <p className="text-gray-600 mb-4">
                            {filter === "mine"
                                ? "You haven't created any blogs yet."
                                : "No blogs available."}
                        </p>
                        {isAuthed && filter === "mine" && (
                            <Link
                                to="/blogs/create"
                                className="inline-block bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800"
                            >
                                Create Your First Blog
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blogs/${blog._id}`}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group"
                            >
                                {blog.imageUrl && (
                                    <div className="h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={blog.imageUrl}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {blog.excerpt || blog.content}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="font-medium">
                                            {blog.author.username}
                                        </span>
                                        <span>
                                            {new Date(
                                                blog.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {blog.tags
                                                .slice(0, 3)
                                                .map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
