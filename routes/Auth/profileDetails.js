import { verifyToken } from "../../app/controllers/tokenController.js";


export const profileDetails = async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        const verifiedToken = await verifyToken(req.headers.token);
        console.log(verifiedToken);
        if (verifiedToken.status === "fail")
            throw new Error(verifiedToken.data);

        const statusCode = (verifiedToken.status === "success") ? 200 : 401;
        return res.status(200).json({
            status: verifiedToken.status,
            data: verifiedToken.data
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