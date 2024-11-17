import { generateToken } from "../utility/tokenUtility.js";
import userGlobal from "../models/userGlobal.js";
import jwt from "jsonwebtoken";

export const createToken = async (username, callback) => {
    const data = await userGlobal.findOneAndUpdate({ username }, { $set: { username } });

    // console.log("before :", data);
    const generatedToken = await generateToken({
        username: data.username,
        uniqueId: data.uniqueId
    })

    const decodeGeneratedToken = await jwt.decode(generatedToken);
    data.tokenId = generatedToken;
    data.expireTime = decodeGeneratedToken.expireTime;
    data.issuedAt = decodeGeneratedToken.issuedAt;
    await data.save();

    // console.log("after :", data);
    // console.log("generated token =", generatedToken);

    callback({
        uniqueId: data.uniqueId,
        tokenId: data.tokenId
    });
};