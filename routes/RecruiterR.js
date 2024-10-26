import express from "express";
import {
  SignupRecruiter,
  LoginRecruiter,
  CreateJob,
  viewApplicants,
} from "../controllers/RecruiterC.js";
import { authRecruiter } from "../middlewares/authVerify.js";

const Router = express.Router();

Router.post("/signup", SignupRecruiter);
Router.post("/login", LoginRecruiter);
Router.post("/createJob", authRecruiter, CreateJob);
Router.get("/viewApplicants", authRecruiter, viewApplicants);

export default Router;
