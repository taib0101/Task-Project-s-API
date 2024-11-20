// import module or file
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { currentDirname } from "../app/utility/dirname.js";
import { authMiddleware } from "../app/middlewares/authMiddleware.js";
import { registration } from "./Auth/registration.js";
import { login } from "./Auth/login.js";
import { profileDetails } from "./Auth/profileDetails.js";
import { createTask } from "./Task/createTask.js";
import { readTask } from "./Task/readTask.js";
import { updateTask } from "./Task/updateTask.js";
import { deleteTask } from "./Task/deleteTask.js";


// config dotenv file
const pathJoin = path.join(currentDirname(import.meta.url), "../app/config/.env");
dotenv.config({ path: pathJoin });

// define router
const router = express.Router();

// for defining requested body as JSON
router.use(express.json());

// sign up
router.post("/Registration", registration);

// log in
router.post("/Login", authMiddleware, login);

// profile details
router.get("/ProfileDetails", profileDetails);

// create task
router.post("/CreateTask", createTask);

// read task
router.get("/ReadTask", readTask);

// update task
router.put("/UpdateTask/:id", updateTask);

// delete task
router.delete("/DeleteTask/:id", deleteTask);

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