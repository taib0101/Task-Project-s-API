import mongoose from "mongoose";

mongoose.set("autoIndex", true);

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email didn't input"],
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
        required: [true, "password didn't input"]
    },

    createdDate: {
        type: String,
        required: [true, "createdDate didn't input"]
    },

    _id: {
        type: String,
        required: [true, "_id didn't input"]
    },

    index: {
        type: Date,
        index: true,
        unique: true,
        index: true
    }
}, { versionKey: false });

schema.index({ email: 1 }, { unique: true, background: true, name: "email" });

const model = new mongoose.model("userLocal", schema);
export default model;