import express from "express";
import { SignupRecruiter, LoginRecruiter } from "../controllers/RecruiterC.js";
import { authRecruiter } from "../middlewares/authVerify.js";

const Router = express.Router();

Router.post("/signup", SignupRecruiter);
Router.post("/login", LoginRecruiter);

export default Router;
