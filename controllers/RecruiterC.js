import RecruiterModel from "../models/Recruiter.js";
import CompanyModel from "../models/Company.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { sendSignup, sendLogin } from "./nodemailer.js";

env.config();
const Secret = process.env.SecretKey;

const SignupRecruiter = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      email,
      password,
      join_date,
      qualification,
      current_position,
      salary,
      company_name,
    } = req.body;
    const ExistingRecruiter = await RecruiterModel.findOne({ email });
    if (ExistingRecruiter) {
      return res
        .status(400)
        .json({ message: "Recruiter already exists.Please login" });
    }
    const company = await CompanyModel.findOne({ name: company_name });
    if (!company) {
      return res.status(400).json({ message: "Company data does not exist." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newRecruiter = new RecruiterModel({
      name,
      age,
      gender,
      email,
      password: hashedPassword,
      join_date,
      qualification,
      current_position,
      salary,
      company_name,
      company_id: company._id,
    });
    company.recruiters.push(newRecruiter._id);
    await company.save();
    await newRecruiter.save();
    sendSignup(req, res);
    return res.status(201).json({
      message: "Recruiter successfully registered",
      Recruiter: newRecruiter,
    });
  } catch (err) {
    console.error("Signup error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const LoginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await RecruiterModel.findOne({ email });
    if (!recruiter) {
      return res
        .status(400)
        .json({ message: "Recruiter profile does not exist" });
    }
    const match = await bcrypt.compare(password, recruiter.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ recruiterId: recruiter._id }, Secret);
    sendLogin(req, res);
    return res.status(201).json({ token, recruiter });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { SignupRecruiter, LoginRecruiter };
