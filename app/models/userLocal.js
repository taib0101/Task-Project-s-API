import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username not input"],
        unique: [true, "take another value"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "email not input"],
        trim: true
    },

    password: {
        type: String,
        required: [true, "password not input"],
        trim: true
    },

    createdTime: {
        type: Date,
        default: Date.now()
    }
}, { versionKey: false });

const model = new mongoose.model("userLocal", schema);
export default model;