import express from "express";
const Router = express.Router();
import verify from "../middlewares/authVerify.js";

import {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
  uploadprofilepic,
  updateprofilepic,
} from "../controllers/userC.js";

import upload from "../middlewares/multer.js";

Router.get("/", verify, HandleGetAllUsers);
Router.post("/signup", upload.single("resume"), signup);
Router.post("/login", login);
Router.put("/:id", verify, HandleUpdateUsers);
Router.delete("/:id", verify, HandleDeleteUsers);
Router.patch("/uploadpic", verify, upload.single("image"), uploadprofilepic);
Router.patch("/updatepic", verify, upload.single("image"), updateprofilepic);

export default Router;
