import express from "express";
import { SignupCompany, LoginCompany } from "../controllers/CompanyC.js";

const Router = express.Router();

Router.post("/signup", SignupCompany);
Router.post("/login", LoginCompany);

export default Router;
