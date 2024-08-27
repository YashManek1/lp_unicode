const express = require("express");
const mongoose = require("mongoose");
const app = express();
const UserRouter = require("./routes/User");
const { ConnectMongoDb } = require("./connection");
const PORT = 8000;
const env = require("dotenv");
const morgan = require("morgan");

app.use(morgan("tiny"));
env.config();
const URL = process.env.Connect_URI;

ConnectMongoDb(URL);

app.use(express.urlencoded({ extended: false }));
app.use("/users", UserRouter);

app.listen(PORT, () => {
  console.log(`Server connected at PORT ${PORT}`);
});
