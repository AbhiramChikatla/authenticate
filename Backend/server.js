// imports

import express from "express";
import { mongoose } from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { userModel } from "../src/models/UserSchema.js";
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
        const userObj={username:findUser.username,email}
        const token = jwt.sign(
            userObj,
            jwtSecret,
            {
                expiresIn: "2h",
            }
        );
        res.cookie("token",token,{
            secure:false,   // important
            sameSite:"lax",
        }).send({ success: true, msg: "Login Successful",user:userObj });
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

app.get("/profile", (req, res) => {

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, user) => {
            if (err){ 
                
                throw err
            
            };
            res.json(user);
        });
    } else {
        res.json(null);
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token").send("Logged Out");
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
