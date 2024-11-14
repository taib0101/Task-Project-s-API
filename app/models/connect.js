import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathJoin = path.join(__dirname, "../config/.env");

dotenv.config({ path: pathJoin })

const URI = (process.env.environment === "staging") ? process.env.DEVELOPMENT_MONGO_UTI :
    process.env.PRODUCTION_MONGO_URI;

export const connect = () => {
    try {
        mongoose.connect(URI);
        console.log("conected database");
    } catch (error) {
        console.log(error.message);
    }
}