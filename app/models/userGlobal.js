import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uniqueId: {
        type: String,
        required: [true, "uniqueId not input"],
        trim: true
    },

    username: {
        type: String,
        required: [true, "username not input"],
        trim: true
    },

    tokenId: {
        type: String,
        trim: true
    },

    expireTime: {
        type: String,
        trim: true
    },

    issuedAt: String

}, { versionKey: false });

const model = new mongoose.model("userGlobal", schema);
export default model;