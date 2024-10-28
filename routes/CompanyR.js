import express from "express";
import { SignupCompany, LoginCompany } from "../controllers/CompanyC.js";
import {
  createBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
} from "../controllers/blogC.js";

import { authCompany } from "../middlewares/authVerify.js";

const Router = express.Router();

Router.post("/signup", SignupCompany);
Router.post("/login", LoginCompany);
Router.post("/createBlog", authCompany, createBlog);
Router.get("/getBlogs", authCompany, getAllBlogs);
Router.delete("/deleteBlog/:id", authCompany, deleteBlog);
Router.put("/updateBlog/:id", authCompany, updateBlog);

export default Router;
