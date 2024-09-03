const express = require("express");
const mongoose = require("mongoose");
const app = express();
const UserRouter = require("./routes/User");
const { ConnectMongoDb } = require("./config/connection");
const env = require("dotenv");
const morgan = require("morgan");
const authDashboard = require("./routes/authDashboard");

app.use(morgan("tiny"));
env.config();
const PORT = process.env.Port;
const URL = process.env.Connect_URI;

ConnectMongoDb(URL);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", UserRouter);
app.use("/dashboard", authDashboard);

app.listen(PORT, () => {
  console.log(`Server connected at PORT ${PORT}`);
});
