import express from "express";
const Router = express.Router();
import verify from "../middlewares/authVerify.js";

import {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
} from "../controllers/user.js";

import { uploadprofilepic, updateprofilepic } from "../controllers/image.js";
import upload from "../middlewares/multer.js";

Router.get("/", verify, HandleGetAllUsers);
Router.post("/signup", signup);
Router.post("/login", login);
Router.put("/:id", verify, HandleUpdateUsers);
Router.delete("/:id", verify, HandleDeleteUsers);
Router.post("/uploadpic", verify, upload.single("image"), uploadprofilepic);
Router.post("/updatepic", verify, upload.single("image"), updateprofilepic);

export default Router;
