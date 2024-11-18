import mongoose from "mongoose";
import userLocal from "../models/userLocal.js";
import { compareFunction } from "../utility/bcrypt.js";

const message = () => {
    return {
        status: "fail",
        data: "No user found, Check email and password and try again!"
    };
}

export const authMiddleware = async (req, res, next) => {
    try {
        // const map = returnReadCollection();
        const { email, password } = req.body;
        let data = await userLocal.find({ email });

        if (!data.length)
            return res.status(401).json(message());

        if (!await compareFunction(password, data[0].password))
            return res.status(401).json(message());

        return next();

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            data: error.message
        });
    }
};