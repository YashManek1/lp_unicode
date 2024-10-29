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
    const token = jwt.sign({ CompanyId: company._id }, Secret);
    return res.status(201).json({ token, company });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const viewCompany = async (req, res) => {
  try {
    const CompanyId = req.company.CompanyId;
    const details = await CompanyModel.findById(CompanyId);
    console.log(details);
    if (!details) {
      return res
        .status(400)
        .json({ message: "Company profile does not exist" });
    }
    return res.status(201).json(details);
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCompany = async (req, res) => {
  try {
    const CompanyId = req.company.CompanyId;
    const company = await CompanyModel.findByIdAndUpdate(CompanyId, req.body, {
      new: true,
    });
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company profile does not exist" });
    }
    return res.status(201).json({
      message: "Company profile updated successfully",
      Company: company,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const CompanyId = req.company.CompanyId;
    const company = await CompanyModel.findByIdAndDelete(CompanyId);
    return res.status(201).json({
      message: "Company profile deleted successfully",
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const viewRecruiters = async (req, res) => {
  try {
    const CompanyId = req.company.CompanyId;
    const company = await CompanyModel.findById(CompanyId).populate(
      "recruiters",
      "name join_date qualification current_position salary"
    );
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company doesn't have any recruiters" });
    }
    return res.status(201).json(company.recruiters);
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeRecruiter = async (req, res) => {
  try {
    const CompanyId = req.company.CompanyId;
    const recruiterId = req.params.id;
    const company = await CompanyModel.findById(CompanyId);
    if (!company) {
      return res
        .status(400)
        .json({ message: "Company profile does not exist" });
    }
    company.recruiters.pull(recruiterId);
    await company.save();
    return res
      .status(201)
      .json({ message: "Successfully removed the recruiter" });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//view all the job applications of the company-remaining

export {
  SignupCompany,
  LoginCompany,
  viewCompany,
  viewRecruiters,
  updateCompany,
  deleteCompany,
  removeRecruiter,
};
