import express from "express";
const app = express();
import UserRouter from "./routes/UserR.js";
import ConnectMongoDb from "./config/connection.js";
import env from "dotenv";
import morgan from "morgan";
import CompanyRouter from "./routes/CompanyR.js";
import RecruiterRouter from "./routes/RecruiterR.js";
import cors from "cors";

app.use(morgan("tiny"));
env.config();
const PORT = process.env.Port;
const URL = process.env.Connect_URI;

ConnectMongoDb(URL);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", UserRouter);
app.use("/company", CompanyRouter);
app.use("/recruiter", RecruiterRouter);

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.listen(PORT, () => {
  console.log(`Server connected at PORT ${PORT}`);
});
