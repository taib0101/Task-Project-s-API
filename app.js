// import module or file
import express from "express";
import dotenv from "dotenv";
import { connect } from "./app/models/connect.js";
import { readCollection } from "./app/utility/readUserCollections.js";
import router from "./routes/api.js"

// configure environment file
dotenv.config({ path: "./app/config/.env" });

// define app
const app = express();

// default middleware
app.use("/taskProject", router);

// select port
const port = (process.env.environment === "staging") ? process.env.PORT_DEVELOPMENT : process.env.PORT_PRODUCTION;

// connect database
connect();

// read user Local and GLobal COllection
readCollection();

// listen port
app.listen(port, () => {
    console.log(`listing port ${port} ...`);
});