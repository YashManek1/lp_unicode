import CompanyModel from "../models/Company.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();
const Secret = process.env.SecretKey;

const SignupCompany = async (req, res) => {
  try {
    const { email, password, name, website_url, description } = req.body;
    const ExistingCompany = await CompanyModel.findOne({ email });
    if (ExistingCompany) {
      return res
        .status(400)
        .json({ message: "Company profile already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const NewCompany = new CompanyModel({
      email,
      password: hashedPassword,
      name,
      website_url,
      description,
    });
    await NewCompany.save();
    return res.status(201).json({
      message: "Company successfully registered",
      Company: NewCompany,
    });
  } catch (err) {
    console.error("Signup error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const LoginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await CompanyModel.findOne({ email });
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company profile does not exist" });
    }
    const match = await bcrypt.compare(password, company.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ companyId: company._id }, Secret);
    return res.status(201).json({ token, company });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { SignupCompany, LoginCompany };
