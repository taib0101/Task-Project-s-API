// import module or file
import express from "express";
import dotenv from "dotenv";
import { connect } from "./app/models/connect.js";
import router from "./routes/api.js"
import cors from "cors";

// configure environment file
dotenv.config({ path: "./app/config/.env" });

// define app
const app = express();

app.set("case sensitive routing", true);

app.use(cors());

// connect database
connect();

// default middleware
app.use("/TaskProject", router);

// 404 error handle
app.use((req, res, next) => {
    return res.status(404).send("Not Found");
});

// select port
const port = (process.env.environment === "staging") ? process.env.PORT_DEVELOPMENT : process.env.PORT_PRODUCTION;

// listen port
app.listen(port, () => {
    console.log(`listing port ${port} ...`);
});