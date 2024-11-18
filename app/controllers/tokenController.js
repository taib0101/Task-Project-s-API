import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import url from "url";
import path from "path";
import { currentDirname } from "../utility/dirname.js";
import userLocal from "../models/userLocal.js"

const pathJoin = path.join(currentDirname(import.meta.url), "../config/.env");

dotenv.config({ path: pathJoin });

export const createToken = async (reqBody) => {
    try {
        let { email, password } = reqBody;

        // update userLocal Collection
        const data = await userLocal.findOne({ email });

        console.log(data);

        const payload = {
            _id: data._id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            mobile: data.mobile,
            createdDate: data.createdDate
        };

        const generateToken = await jwt.sign(payload, process.env.PRIVATE_KEY, { algorithm: "RS512" });

        return {
            status: "success",
            data: payload,
            token: generateToken
        };
    } catch (error) {
        console.log(error.message);
        return {
            status: "fail",
            data: error.message
        };
    }
};

export const verifyToken = async (token) => {
    try {
        const {
            _id,
            email,
            firstName,
            lastName,
            mobile,
            createdDate
        } = await jwt.verify(token, process.env.PUBLIC_KEY, { algorithm: "RS512" });
        
        return {
            status: "success",
            data: {
                _id,
                email,
                firstName,
                lastName,
                mobile,
                createdDate
            }
        };
    } catch (error) {
        return {
            status: "fail",
            data: error.message
        };
    }
};