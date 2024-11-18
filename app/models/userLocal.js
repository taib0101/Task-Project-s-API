import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email didn't input"],
        unique: [true, "take another value"],
        trim: true
    },

    firstName: {
        type: String,
        required: [true, "firstName didn't input"],
        trim: true
    },

    lastName: {
        type: String,
        required: [true, "lastName didn't input"],
        trim: true
    },

    mobile: {
        type: String,
        required: [true, "mobile didn't input"],
        trim: true
    },

    password: {
        type: String,
        require: [true, "password didn't input"]
    },

    createdDate: {
        type: String,
        require: [true, "createdDate didn't input"]
    },

    _id: {
        type: String,
        require: [true, "_id didn't input"]
    }
}, { versionKey: false });

const model = new mongoose.model("userLocal", schema);
export default model;