import mongoose, { Schema, SchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: { type: String, minLength: 8, required: true },
    
});
export const userModel = mongoose.model("user", userSchema);
