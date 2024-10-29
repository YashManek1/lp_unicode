import express from "express";
import {
  SignupRecruiter,
  LoginRecruiter,
  CreateJob,
  viewApplicants,
  updateJob,
  deleteJob,
  viewJobDetails,
  shortlistApplicants,
  rejectApplicants,
  acceptApplicants,
} from "../controllers/RecruiterC.js";

import { authRecruiter } from "../middlewares/authVerify.js";

const Router = express.Router();

Router.post("/signup", SignupRecruiter);
Router.post("/login", LoginRecruiter);
Router.post("/createJob", authRecruiter, CreateJob);
Router.get("/viewApplicants", authRecruiter, viewApplicants);
Router.put("/updateJob/:id", authRecruiter, updateJob);
Router.delete("/deleteJob/:id", authRecruiter, deleteJob);
Router.get("/jobDetails", authRecruiter, viewJobDetails);
Router.post("/shortlist", authRecruiter, shortlistApplicants);
Router.post("/reject", authRecruiter, rejectApplicants);
Router.post("/accept", authRecruiter, acceptApplicants);

export default Router;
