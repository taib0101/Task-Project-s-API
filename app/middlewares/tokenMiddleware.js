import userGlobal from "../models/userGlobal.js";
import jwt from "jsonwebtoken";

export const tokenExpireTime = async (req, res, next) => {

    try {
        const data = await userGlobal.find({ uniqueId: req.params.id });
        if (!data.length) return res.status(404).send("unauthorized");

        const verify = await jwt.verify(req.body.tokenId, process.env.PUBLIC_KEY, { algorithm: "RS512" })
        const currentTime = new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

        if (currentTime > verify.expireTime) {
            const data = await userGlobal.findOneAndUpdate({ uniqueId: verify.uniqueId }, { $set: { uniqueId: verify.uniqueId } });
            data.tokenId = "";
            data.expireTime = "";
            data.issuedAt = "";
            data.save();

            return res.status(200).send("login again");
        }
        return next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).send(error.message);
    }
};