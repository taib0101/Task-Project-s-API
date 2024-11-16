import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { currentDirname } from "./dirname.js";
import path from "path";
import url from "url";
import { now } from "mongoose";

const pathJoin = path.join(currentDirname(import.meta.url), "../config/.env");

dotenv.config({ path: pathJoin });

export const generateToken = (information) => {
    information.expireTime = new Date(Date.now() + (1000 * 60 * 60)).toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    information.issuedAt = new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    return jwt.sign(information, process.env.PRIVATE_KEY, { algorithm: "RS512" });
}