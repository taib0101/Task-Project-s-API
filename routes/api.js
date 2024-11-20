// import module or file
import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import { currentDirname } from "../app/utility/dirname.js";
import { uniqueIdFunction } from "../app/utility/generateUniqueId.js";
import userLocal from "../app/models/userLocal.js";
import task from "../app/models/task.js";
import { hashFunction } from "../app/utility/bcrypt.js";
import { authMiddleware } from "../app/middlewares/authMiddleware.js";
import { createToken, verifyToken } from "../app/controllers/tokenController.js";
import mongoose from "mongoose";

// config dotenv file
const pathJoin = path.join(currentDirname(import.meta.url), "../app/config/.env");
dotenv.config({ path: pathJoin });

// define router
const router = express.Router();

// for defining requested body as JSON
router.use(express.json());

// sign up
router.post("/Registration", async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        // destruct from request body
        const {
            email,
            firstName,
            lastName,
            mobile,
            password
        } = req.body;

        console.log(`email: ${email}`);
        console.log(`firstName: ${firstName}`);
        console.log(`lastName: ${lastName}`);
        console.log(`mobile: ${mobile}`);
        console.log(`password: ${password}`);

        // insert one data to userLocal model or collection
        const data = await new userLocal({
            email,
            firstName,
            lastName,
            mobile,
            password: await hashFunction(req.body.password),
            createdDate: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
            _id: await uniqueIdFunction()
        });
        await data.save();

        console.log("\n inserted Data :", data);
        // response json to client
        return res.status(200).json({
            status: "success",
            data: [
                {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobile: data.lastName,
                    createdDate: data.createdDate,
                }
            ]
        });
    } catch (error) {
        console.log(error.message);
        const string = error.message.split(" ");
        if (string.includes("duplicate"))
            return res.status(400).json({
                status: "fail",
                data: "This email is already registered! Try again with different email"
            });

        return res.status(500).json({
            status: "fail",
            data: error.message
        });
    }
});

// log in
router.post("/Login", authMiddleware, async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const createdToken = await createToken(req.body);
        return res.status(200).json({
            status: createdToken.status,
            data: createdToken.data,
            token: createdToken.token
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            data: error.message
        });
    }
});

// profile details
router.get("/ProfileDetails", async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        console.log(verifiedToken);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const statusCode = (verifiedToken.status === "success") ? 200 : 401;
        return res.status(200).json({
            status: verifiedToken.status,
            data: verifiedToken.data
        });
    } catch (error) {
        if (error.message)
            return res.status(401).json({
                status: "fail",
                data: error.message
            });

        return res.status(500).json({
            status: "fail",
            data: "Internal server error"
        });
    }
});

// create task
router.post("/CreateTask", async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const {
            title,
            description,
            status
        } = req.body;

        const payload = {
            title,
            description,
            status,
            email: verifiedToken.data.email,
            createdDate: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        };

        const databasePayload = { ...payload };
        databasePayload.userId = verifiedToken.data._id;

        const data = await new task(databasePayload);
        await data.save();

        console.log("verified data :", verifiedToken);
        console.log("payload :", payload);

        return res.status(200).json({
            status: verifiedToken.status,
            data: payload
        });
    } catch (error) {
        if (error.message)
            return res.status(401).json({
                status: "fail",
                data: error.message
            })

        return res.status(500).json({
            status: "fail",
            data: "Internal server error"
        });
    }
});

// read task
router.get("/ReadTask", async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const data = await task.find({ userId: { $eq: verifiedToken.data._id } });
        console.log("read data :", data);

        return res.status(200).json({
            status: "success",
            data
        })
    } catch (error) {
        if (error.message)
            return res.status(401).json({
                status: "fail",
                data: error.message
            })

        return res.status(500).json({
            status: "fail",
            data: "Internal server error"
        });
    }
});

// update task
router.put("/UpdateTask/:id", async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const {
            title,
            description
        } = req.body;

        const data = await task.findOneAndUpdate({
            $and: [
                { userId: { $eq: verifiedToken.data._id } },
                { _id: { $eq: req.params.id } }
            ]
        }, { $set: { title, description, status: "old" } });
        console.log("updated data successfully");

        return res.status(200).json({
            status: "success",
            data: {
                title,
                description,
                status: "old"
            }
        });

    } catch (error) {
        if (error.message)
            return res.status(401).json({
                status: "fail",
                data: error.message
            });

        return res.status(500).json({
            status: "fail",
            data: "Internal server error"
        });
    }
});

// 404 error
router.use((req, res, next) => {
    next("Request URL Not Found");
})

// other error
router.use((err, req, res, next) => {
    if (err.message) {
        res.status(500).send(err.message);
    } else {
        res.status(404).send("Not Found");
    }
})

export default router;