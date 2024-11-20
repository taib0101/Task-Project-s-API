import { verifyToken } from "../../app/controllers/tokenController.js";
import task from "../../app/models/task.js";

export const createTask = async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const {
            title,
            description,
            status
        } = req.body;

        const payload = {
            title,
            description,
            status,
            email: verifiedToken.data.email,
            createdDate: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        };

        const databasePayload = { ...payload };
        databasePayload.userId = verifiedToken.data._id;

        const data = await new task(databasePayload);
        await data.save();

        console.log("verified data :", verifiedToken);
        console.log("payload :", payload);

        return res.status(200).json({
            status: verifiedToken.status,
            data: payload
        });
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