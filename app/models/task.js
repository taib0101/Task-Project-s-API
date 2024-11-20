import mongoose from "mongoose";

mongoose.set("autoIndex", true);

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title required"]
    },

    description: {
        type: String,
        required: [true, "description required"]
    },

    status: {
        type: String,
        required: [true, "status required"]
    },

    email: {
        type: String,
        required: [true, "email required"]
    },

    userId: {
        type: String,
        required: [true, "userID required"],
        index: true,
        unique: false
    }
}, { versionKey: false });

const model = new mongoose.model("task", schema);

export default model;