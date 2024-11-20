import { verifyToken } from "../../app/controllers/tokenController.js";
import task from "../../app/models/task.js";

export const readTask = async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const data = await task.find({ userId: { $eq: verifiedToken.data._id } });
        console.log("read data :", data);

        return res.status(200).json({
            status: "success",
            data
        })
    } catch (error) {
        if (error.message)
            return res.status(401).json({
                status: "fail",
                data: error.message
            })

        return res.status(500).json({
            status: "fail",
            data: "Internal server error"
        });
    }
}