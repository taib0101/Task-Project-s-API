// import module or file
import express from "express";
import userLocalModel from "../app/models/userLocal.js";
import bcrypt from "bcrypt";
import path from "path";
import url from "url";
import dotenv from "dotenv";

// config dotenv file
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathJoin = path.join(__dirname, "../app/config/.env");
dotenv.config({ path: pathJoin });

// define router
const router = express.Router();

// for defining requested body as JSON
router.use(express.json());

// log in
router.post("/login", (req, res) => {

});

// sign up
router.post("/signup", async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS));
        const data = await new userLocalModel(req.body);
        await data.save();
        res.status(200).send("inserted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

// 404 error
router.use((req, res, next) => {
    next("Request URL Not Found");
})

// other error
router.use((err, req, res, next) => {
    console.log(err.message);
    if (err.message) {
        res.status(500).send(err.message);
    } else {
        res.status(404).send("Not Found");
    }
})

export default router;