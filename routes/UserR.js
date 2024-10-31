import express from "express";
const Router = express.Router();
import { authUser } from "../middlewares/authVerify.js";

import {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
  uploadprofilepic,
  updateprofilepic,
  applyJob,
  getUserAppliedJobs,
} from "../controllers/userC.js";

import {
  follow,
  unfollow,
  getAllFollowers,
  getAllFollowing,
} from "../controllers/FollowC.js";

import {
  createBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  getBlogsOfUser,
} from "../controllers/BlogC.js";

import upload from "../middlewares/multer.js";

Router.get("/", authUser, HandleGetAllUsers);
Router.post("/signup", upload.single("resume"), signup);
Router.post("/login", login);
Router.put("/update/:id", authUser, HandleUpdateUsers);
Router.delete("/delete/:id", authUser, HandleDeleteUsers);
Router.patch("/uploadpic", authUser, upload.single("image"), uploadprofilepic);
Router.patch("/updatepic", authUser, upload.single("image"), updateprofilepic);
Router.post("/apply", authUser, applyJob);
Router.post("/follow", authUser, follow);
Router.post("/unfollow", authUser, unfollow);
Router.get("/AllFollowers/:id", authUser, getAllFollowers);
Router.get("/AllFollowing", authUser, getAllFollowing);
Router.post("/createBlog", authUser, createBlog);
Router.get("/getAllBlogs", authUser, getAllBlogs);
Router.get("/getBlogs", authUser, getBlogsOfUser);
Router.delete("/deleteBlog/:id", authUser, deleteBlog);
Router.put("/updateBlog/:id", authUser, updateBlog);
Router.get("/appliedJobs", authUser, getUserAppliedJobs);

export default Router;
