// imports

import express from "express";
import { mongoose } from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { userModel } from "../src/models/UserSchema.js";
import { blogModel } from "../src/models/blogSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// Connection URL
const url = process.env.MONGO_URI;

// code written for accepting cookies
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

// Database Name
const dbName = "react-authentication";

// jwt secret

const jwtSecret = "yourjwtsecret";

await mongoose.connect(process.env.MONGO_URI, {
    dbName: dbName,
});
console.log("Connected successfully to server");

//  instantiations
const app = express();
const port = 3000;

//  middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

// functions

// api's

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/createaccount", async (req, res) => {
    const { username, mail, password } = req.body;
    // console.log(username, mail, password);

    // this authentication is not required bcoz mongoose will take care of it
    // if (!(username && mail && password)) {
    //     res.status(400).json("please enter all the fields");
    // }
    const existingUser = await userModel.findOne({ email: mail });
    if (existingUser) {
        res.status(200).send({ success: false, msg: "User already exists" });
        return;
    }
    //  code for encryption
    try {
        const EncPassword = await bcrypt.hash(password, 10);

        const createUser = await userModel.create({
            username,
            email: mail,
            password: EncPassword,
        });
        const token = jwt.sign({ username: username, email: mail }, jwtSecret, {
            expiresIn: "1h",
        });
        // createUser.token = token;
        // createUser.password = undefined;
        // console.log(createUser);

        // res.send({
        //     success: true,
        //     msg: "Account Created Successfully",
        //     token:token
        // });
        res.cookie("token", token, { sameSite: "lax" }).send({
            success: true,
            msg: "Account Created Successfully",
            user: createUser,
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
        // console.log(error);
    }
});
app.post("/login", async (req, res) => {
    // collecting data
    const { email, password } = req.body;
    // console.log(email, password);

    // processing skip this part bcoz mongoose will take care of it

    // finding the document
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
        res.send({ success: false, msg: "User not found" });
    }

    // password checking
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (isMatch) {
        const userObj = { username: findUser.username, email };
        const token = jwt.sign(userObj, jwtSecret, {
            expiresIn: "2h",
        });
        res.cookie("token", token, {
            secure: false, // important
            sameSite: "lax",
        }).send({ success: true, msg: "Login Successful", user: userObj });
    } else {
        res.send({ success: false, msg: "Incorrect Password" });
    }
    // sent a message through the response
});
app.post("/newpassword", (req, res) => {
    const { oldpassword, newpassword } = req.body;
    console.log(oldpassword, newpassword);
    res.send({ oldpassword, newpassword });
});

app.get("/profile", async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json(null);
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await userModel.findOne(
            { email: decoded.email },
            "username email bio createdAt _id isAdmin"
        );
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(401).json({ success: false, msg: "Invalid token" });
    }
});

app.put("/profile", async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const { username, bio } = req.body;
        const update = {};
        if (typeof username === "string" && username.trim().length > 0) {
            update.username = username.trim();
        }
        if (typeof bio === "string") {
            update.bio = bio;
        }
        if (Object.keys(update).length === 0) {
            return res
                .status(400)
                .json({ success: false, msg: "No valid fields to update" });
        }
        const updated = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { $set: update },
            { new: true, fields: "username email bio createdAt _id" }
        );
        if (!updated) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }
        const newToken = jwt.sign(
            { username: updated.username, email: updated.email },
            jwtSecret,
            { expiresIn: "2h" }
        );
        res.cookie("token", newToken, {
            secure: false,
            sameSite: "lax",
        }).json({ success: true, user: updated });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Update failed",
            error: err?.message || err,
        });
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token").send("Logged Out");
});

// Blog routes
app.post("/blogs", async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const { title, content, excerpt, imageUrl, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                msg: "Title and content are required",
            });
        }

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }

        const blog = await blogModel.create({
            title,
            content,
            excerpt: excerpt || content.substring(0, 150),
            imageUrl: imageUrl || "",
            author: {
                userId: user._id,
                username: user.username,
                email: user.email,
            },
            tags: tags || [],
        });

        res.status(201).json({ success: true, blog });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to create blog",
            error: err?.message || err,
        });
    }
});

app.get("/blogs", async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { "author.userId": userId } : {};
        const blogs = await blogModel.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to fetch blogs",
            error: err?.message || err,
        });
    }
});

app.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, msg: "Blog not found" });
        }
        res.json({ success: true, blog });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to fetch blog",
            error: err?.message || err,
        });
    }
});

app.put("/blogs/:id", async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const blog = await blogModel.findById(req.params.id);

        if (!blog) {
            return res
                .status(404)
                .json({ success: false, msg: "Blog not found" });
        }

        if (blog.author.email !== decoded.email) {
            return res.status(403).json({
                success: false,
                msg: "Not authorized to edit this blog",
            });
        }

        const { title, content, excerpt, imageUrl, tags } = req.body;
        const update = {};
        if (title) update.title = title;
        if (content) update.content = content;
        if (excerpt !== undefined) update.excerpt = excerpt;
        if (imageUrl !== undefined) update.imageUrl = imageUrl;
        if (tags) update.tags = tags;

        const updated = await blogModel.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { new: true }
        );

        res.json({ success: true, blog: updated });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to update blog",
            error: err?.message || err,
        });
    }
});

app.delete("/blogs/:id", async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const blog = await blogModel.findById(req.params.id);

        if (!blog) {
            return res
                .status(404)
                .json({ success: false, msg: "Blog not found" });
        }

        if (blog.author.email !== decoded.email) {
            return res.status(403).json({
                success: false,
                msg: "Not authorized to delete this blog",
            });
        }

        await blogModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: "Blog deleted successfully" });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to delete blog",
            error: err?.message || err,
        });
    }
});

// Admin routes
// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user || !user.isAdmin) {
            return res
                .status(403)
                .json({ success: false, msg: "Access denied. Admin only." });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, msg: "Invalid token" });
    }
};

// Get all users (Admin only)
app.get("/admin/users", isAdmin, async (req, res) => {
    try {
        const users = await userModel
            .find({}, "-password")
            .sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to fetch users",
            error: err?.message || err,
        });
    }
});

// Get all blogs (Admin only)
app.get("/admin/blogs", isAdmin, async (req, res) => {
    try {
        const blogs = await blogModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to fetch blogs",
            error: err?.message || err,
        });
    }
});

// Delete any blog (Admin only)
app.delete("/admin/blogs/:id", isAdmin, async (req, res) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, msg: "Blog not found" });
        }
        await blogModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: "Blog deleted successfully" });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to delete blog",
            error: err?.message || err,
        });
    }
});

// Create a new user (Admin only)
app.post("/admin/users", isAdmin, async (req, res) => {
    try {
        const { username, email, password, isAdmin: makeAdmin } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Username, email, and password are required",
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User with this email already exists",
            });
        }

        const encPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            email,
            password: encPassword,
            isAdmin: makeAdmin || false,
        });

        res.status(201).json({
            success: true,
            msg: "User created successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                createdAt: newUser.createdAt,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to create user",
            error: err?.message || err,
        });
    }
});

// Delete a user (Admin only)
app.delete("/admin/users/:id", isAdmin, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                msg: "Cannot delete your own account",
            });
        }

        await userModel.findByIdAndDelete(req.params.id);

        // Also delete all blogs by this user
        await blogModel.deleteMany({ "author.userId": req.params.id });

        res.json({
            success: true,
            msg: "User and their blogs deleted successfully",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Failed to delete user",
            error: err?.message || err,
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
