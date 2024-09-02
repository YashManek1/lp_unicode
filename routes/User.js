const express = require("express");
const Router = express.Router();
const {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
} = require("../controllers/user");

Router.get("/", HandleGetAllUsers);
Router.post("/signup", signup);
Router.post("/login", login);
Router.put("/:id", HandleUpdateUsers);
Router.delete("/:id", HandleDeleteUsers);

module.exports = Router;
