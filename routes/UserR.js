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
} from "../controllers/userC.js";

import upload from "../middlewares/multer.js";

Router.get("/", authUser, HandleGetAllUsers);
Router.post("/signup", upload.single("resume"), signup);
Router.post("/login", login);
Router.put("/:id", authUser, HandleUpdateUsers);
Router.delete("/:id", authUser, HandleDeleteUsers);
Router.patch("/uploadpic", authUser, upload.single("image"), uploadprofilepic);
Router.patch("/updatepic", authUser, upload.single("image"), updateprofilepic);
Router.post("/apply", authUser, applyJob);

export default Router;
