import { hash, compare } from "bcrypt";
import dotenv from "dotenv";
import url from "url";
import path from "path";
import { currentDirname } from "../utility/dirname.js";

const pathJoin = path.join(currentDirname(import.meta.url), "../config/.env");
dotenv.config({ path: pathJoin });

export const hashFunction = (password) => {
    return hash(password, parseInt(process.env.SALTROUNDS));
}

export const compareFunction = (databasePassword, givenPassword) => {
    return compare(databasePassword, givenPassword);
}