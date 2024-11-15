import crypto, { randomBytes } from "crypto";

export const uniqueIdFunction = () => {
    return  randomBytes(parseInt(process.env.UNIQUEIDBYTES)).toString("hex");
}