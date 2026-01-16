import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        excerpt: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
        author: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            username: { type: String, required: true },
            email: { type: String, required: true },
        },
        tags: [{ type: String }],
        published: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const blogModel = mongoose.model("blog", blogSchema);
