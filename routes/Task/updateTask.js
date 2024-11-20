import { verifyToken } from "../../app/controllers/tokenController.js";
import task from "../../app/models/task.js";

export const updateTask = async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const {
            title,
            description
        } = req.body;

        const data = await task.findOneAndUpdate({
            $and: [
                { userId: { $eq: verifiedToken.data._id } },
                { _id: { $eq: req.params.id } }
            ]
        }, { $set: { title, description, status: "old" } });
        console.log("updated data successfully");

        return res.status(200).json({
            status: "success",
            data: {
                title,
                description,
                status: "old"
            }
        });

    } catch (error) {
        if (error.message)
            return res.status(401).json({
                status: "fail",
                data: error.message
            });

        return res.status(500).json({
            status: "fail",
            data: "Internal server error"
        });
    }
}