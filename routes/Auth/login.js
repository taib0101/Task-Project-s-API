import { createToken } from "../../app/controllers/tokenController.js";

export const login = async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        // creating token
        const createdToken = await createToken(req.body);
        return res.status(200).json({
            status: createdToken.status,
            data: createdToken.data,
            token: createdToken.token
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            data: error.message
        });
    }
}