import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";

const CreateBlog = () => {
    const { LoginUser } = useContext(userContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        content: "",
        excerpt: "",
        imageUrl: "",
        tags: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const isAuthed = Boolean(LoginUser && LoginUser.username);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.title.trim() || !form.content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("http://localhost:3000/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: form.title.trim(),
                    content: form.content.trim(),
                    excerpt: form.excerpt.trim(),
                    imageUrl: form.imageUrl.trim(),
                    tags: form.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data?.msg || "Failed to create blog");
            }
            navigate(`/blogs/${data.blog._id}`);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Authentication Required
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Please log in to create a blog post.
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="p-8 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create New Blog
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Share your thoughts with the world
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="rounded-lg px-4 py-3 bg-red-50 text-red-700 border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={onChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="Enter a catchy title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={onChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="https://example.com/image.jpg"
                            />
                            {form.imageUrl && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={form.imageUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                name="excerpt"
                                value={form.excerpt}
                                onChange={onChange}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="Brief summary (optional, auto-generated if empty)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={onChange}
                                rows={12}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="Write your blog content here..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={form.tags}
                                onChange={onChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="technology, travel, lifestyle (comma-separated)"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
                            >
                                {saving ? "Publishing..." : "Publish Blog"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/blogs")}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
