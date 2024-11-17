import userGlobal from "../models/userGlobal.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import url from "url";
import path from "path";
import { currentDirname } from "../utility/dirname.js";

const pathJoin = path.join(currentDirname(import.meta.url), "../config/.env");

dotenv.config({ path: pathJoin });

export const createToken = async (username) => {
    try {
        // update userGlobal Collection
        const data = await userGlobal.findOneAndUpdate({ username }, { $set: { username } });

        const payload = {
            username: data.username,
            uniqueId: data.uniqueId,
            expireTime: new Date(Date.now() + (1000 * 60)).toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
            issuedAt: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        };
        const generateToken = await jwt.sign(payload, process.env.PRIVATE_KEY, { algorithm: "RS512" });

        data.tokenId = generateToken;
        data.expireTime = payload.expireTime;
        data.issuedAt = payload.issuedAt;
        await data.save();
    
        return {
            uniqueId: data.uniqueId,
            tokenId: data.tokenId
        };
    } catch (error) {
        console.log(error.message);
        return {};
    }
};
