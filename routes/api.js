// import module or file
import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import { uniqueIdFunction } from "../app/utility/generateUniqueId.js";
import userLocalModel from "../app/models/userLocal.js";
import userGlobalModel from "../app/models/userGlobal.js";
import { readCollection } from "../app/utility/readUserCollections.js";
import { authMiddleware } from "../app/middlewares/authMiddleware.js";
import { currentDirname } from "../app/utility/dirname.js";
import { hashFunction } from "../app/utility/bcrypt.js";


// config dotenv file
const pathJoin = path.join(currentDirname(import.meta.url), "../app/config/.env");
dotenv.config({ path: pathJoin });

// define router
const router = express.Router();

// for defining requested body as JSON
router.use(express.json());

// log in
router.post("/login", authMiddleware, (req, res) => {
    res.status(200).send("Welcome")
});

// sign up
router.post("/signup", async (req, res) => {
    try {
        req.body.password = await hashFunction(req.body.password);
        const data1 = await new userLocalModel(req.body);

        const uniqueId = uniqueIdFunction();
        const data2 = await new userGlobalModel({
            uniqueId,
            username: req.body.username,
            tokenId: "",
            expireTime: "",
            issuedAt: ""
        });

        await data1.save();
        await data2.save();

        await readCollection();
        return res.status(200).send("inserted successfully");
    } catch (error) {
        const string = error.message.split(" ");
        if (string.includes("duplicate"))
            return res.status(404).send("give unique user name");
        return res.status(500).send(error.message);
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