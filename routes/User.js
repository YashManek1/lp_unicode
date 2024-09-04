const express = require("express");
const Router = express.Router();
const verify = require("../middlewares/authVerify");

const {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
} = require("../controllers/user");

Router.get("/", verify, HandleGetAllUsers);
Router.post("/signup", signup);
Router.post("/login", login);
Router.put("/:id", verify, HandleUpdateUsers);
Router.delete("/:id", verify, HandleDeleteUsers);

module.exports = Router;
