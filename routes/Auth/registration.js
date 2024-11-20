import userLocal from "../../app/models/userLocal.js";
import { hashFunction } from "../../app/utility/bcrypt.js";
import { uniqueIdFunction } from "../../app/utility/generateUniqueId.js";


export const registration = async (req, res) => {
    console.log(`route: http://127.0.0.1${req.originalUrl}\n`);

    try {
        // destruct from request body
        const {
            email,
            firstName,
            lastName,
            mobile,
            password
        } = req.body;

        console.log(`email: ${email}`);
        console.log(`firstName: ${firstName}`);
        console.log(`lastName: ${lastName}`);
        console.log(`mobile: ${mobile}`);
        console.log(`password: ${password}`);

        // insert one data to userLocal model or collection
        const data = await new userLocal({
            email,
            firstName,
            lastName,
            mobile,
            password: await hashFunction(req.body.password),
            createdDate: new Date(Date.now()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
            _id: await uniqueIdFunction()
        });
        await data.save();

        console.log("\n inserted Data :", data);
        // response json to client
        return res.status(200).json({
            status: "success",
            data: [
                {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobile: data.mobile,
                    createdDate: data.createdDate,
                }
            ]
        });
    } catch (error) {
        console.log(error.message);
        const string = error.message.split(" ");
        if (string.includes("duplicate"))
            return res.status(400).json({
                status: "fail",
                data: "This email is already registered! Try again with different email"
            });

        return res.status(500).json({
            status: "fail",
            data: error.message
        });
    }
}