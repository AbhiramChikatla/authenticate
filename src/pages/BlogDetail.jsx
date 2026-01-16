import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userContext } from "../context/userContext";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { LoginUser } = useContext(userContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:3000/blogs/${id}`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data?.msg || "Failed to fetch blog");
            }
            setBlog(data.blog);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this blog?")) {
            return;
        }
        setDeleting(true);
        try {
            const res = await fetch(`http://localhost:3000/blogs/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data?.msg || "Failed to delete blog");
            }
            navigate("/blogs");
        } catch (err) {
            alert(err.message || "Failed to delete blog");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center py-12">
                    <p className="text-gray-600">Loading blog...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Blog Not Found
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {error ||
                                "The blog you're looking for doesn't exist."}
                        </p>
                        <Link
                            to="/blogs"
                            className="inline-block bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800"
                        >
                            Back to Blogs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isAuthor = LoginUser?.email === blog.author.email;

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    to="/blogs"
                    className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium mb-6"
                >
                    <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Blogs
                </Link>

                <article className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    {blog.imageUrl && (
                        <div className="w-full h-96 overflow-hidden bg-gray-100">
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    {blog.title}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">
                                            {blog.author.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {blog.author.username}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {blog.author.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span>•</span>
                                    <span>
                                        {new Date(
                                            blog.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                            {isAuthor && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 transition"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            )}
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="prose max-w-none">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {blog.content}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Last updated:{" "}
                                {new Date(blog.updatedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;
