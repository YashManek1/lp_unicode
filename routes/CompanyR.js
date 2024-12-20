import express from "express";

import {
  SignupCompany,
  LoginCompany,
  viewCompany,
  updateCompany,
  deleteCompany,
  viewRecruiters,
  removeRecruiter,
  addRecruiter,
} from "../controllers/CompanyC.js";

import {
  createBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  getBlogsOfCompany,
} from "../controllers/BlogC.js";

import {
  follow,
  unfollow,
  getAllFollowers,
  getAllFollowing,
} from "../controllers/FollowC.js";

import { authCompany } from "../middlewares/authVerify.js";

const Router = express.Router();

Router.post("/signup", SignupCompany);
Router.post("/login", LoginCompany);
Router.post("/createBlog", authCompany, createBlog);
Router.get("/getAllBlogs", authCompany, getAllBlogs);
Router.get("/getBlogs", authCompany, getBlogsOfCompany);
Router.delete("/deleteBlog/:id", authCompany, deleteBlog);
Router.put("/updateBlog/:id", authCompany, updateBlog);
Router.post("/follow", authCompany, follow);
Router.post("/unfollow", authCompany, unfollow);
Router.get("/AllFollowers/:id", authCompany, getAllFollowers);
Router.get("/AllFollowing", authCompany, getAllFollowing);
Router.get("/view", authCompany, viewCompany);
Router.put("/update/:id", authCompany, updateCompany);
Router.delete("/delete/:id", authCompany, deleteCompany);
Router.get("/viewRecruiters", authCompany, viewRecruiters);
Router.delete("/removeRecruiter/:id", authCompany, removeRecruiter);
Router.patch("/addRecruiter/:id", authCompany, addRecruiter);

export default Router;
