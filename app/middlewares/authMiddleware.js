import mongoose from "mongoose";
import userLocal from "../models/userLocal.js";
import { returnReadCollection } from "../utility/readUserCollections.js";
import { compareFunction } from "../utility/bcrypt.js";

export const authMiddleware = async (req, res, next) => {
    // const map = returnReadCollection();
    const { username, password } = req.body;
    let data = await userLocal.find({ username });

    if (!data) return res.status(401).send("Invalid Username or Password");

    if (!await compareFunction(password, data[0].password))
        return res.status(401).send("Invalid Username or Password");

    return next();
};