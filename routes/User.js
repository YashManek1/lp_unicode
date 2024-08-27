const express = require("express");
const Router = express.Router();
const {
  HandleGetAllUsers,
  HandleAddUsers,
  HandleUpdateUsers,
  HandleDeleteUsers,
} = require("../controllers/user");

Router.get("/", HandleGetAllUsers);
Router.post("/", HandleAddUsers);
Router.put("/:id", HandleUpdateUsers);
Router.delete("/:id", HandleDeleteUsers);

module.exports = Router;
