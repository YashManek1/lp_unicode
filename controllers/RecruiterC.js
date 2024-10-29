import RecruiterModel from "../models/Recruiter.js";
import CompanyModel from "../models/Company.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import JobModel from "../models/Job.js";
import { sendSignup, sendLogin } from "./nodemailer.js";
import ApplicationModel from "../models/Application.js";

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

const CreateJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary_range,
      location,
      job_type,
      recruiter_name,
    } = req.body;
    const recruiter = await RecruiterModel.findById(req.recruiter.recruiterId);
    if (!recruiter) {
      return res.status(401).send("Recruiter not found");
    }
    if (recruiter_name !== recruiter.name) {
      return res
        .status(403)
        .send("Recruiter not authorized for this operation");
    }
    const newJob = new JobModel({
      title: title,
      description: description,
      requirements: requirements.split(","),
      salary_range: salary_range,
      location: location,
      job_type: job_type,
      recruiter_name: recruiter_name,
      recruiter_id: recruiter._id,
      company_name: recruiter.company_name,
      company_id: recruiter.company_id,
    });
    await newJob.save();
    return res.status(201).json({ Job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating job." });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await JobModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json({ message: "Job details updated successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await JobModel.findByIdAndDelete(req.params.id);
    res.status(201).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const viewJobDetails = async (req, res) => {
  try {
    const jobs = await JobModel.find({
      recruiter_id: req.recruiter.recruiterId,
    });
    return res.status(201).send(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const viewApplicants = async (req, res) => {
  try {
    const jobs = await JobModel.find({
      recruiter_id: req.recruiter.recruiterId,
    });
    if (jobs.length == 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this recruiter" });
    }
    const jobIDs = jobs.map((job) => job._id);
    const applications = await ApplicationModel.find({
      job_id: { $in: jobIDs },
    })
      .populate("user_id", "username email resume")
      .select("job_title status applied_date user_id username resume");
    if (applications.length == 0) {
      return res.status(404).send("No applicants found for this job");
    }
    return res.status(201).json({ Applicants: applications });
  } catch (err) {
    console.error(err);
    return res.status(404).send("Server error ", err);
  }
};

const shortlistApplicants = async (req, res) => {
  try {
    const recruiterId = req.recruiter.recruiterId;
    const applicationId = req.body.applicationId;
    const application = await ApplicationModel.findById(applicationId).populate(
      { path: "job_id", select: "recruiter_id" }
    );
    if (
      application &&
      application.job_id.recruiter_id.toString() === recruiterId.toString()
    ) {
      application.status = "shortlisted";
      res
        .status(201)
        .json({ message: "Applicant successfully shortlisted", application });
    } else {
      res
        .status(400)
        .json({ message: "Unauthorized access to the application" });
    }
  } catch (err) {
    console.error(err);
    return res.status(404).send("Server error ", err);
  }
};

const rejectApplicants = async (req, res) => {
  try {
    const recruiterId = req.recruiter.recruiterId;
    const applicationId = req.body.applicationId;
    const application = await ApplicationModel.findById(applicationId).populate(
      { path: "job_id", select: "recruiter_id" }
    );
    if (
      application &&
      application.job_id.recruiter_id.toString() === recruiterId.toString()
    ) {
      application.status = "rejected";
      res
        .status(201)
        .json({ message: "Applicant successfully rejected", application });
    } else {
      res
        .status(400)
        .json({ message: "Unauthorized access to the application" });
    }
  } catch (err) {
    console.error(err);
    return res.status(404).send("Server error ", err);
  }
};

const acceptApplicants = async (req, res) => {
  try {
    const recruiterId = req.recruiter.recruiterId;
    const applicationId = req.body.applicationId;
    const application = await ApplicationModel.findById(applicationId).populate(
      { path: "job_id", select: "recruiter_id" }
    );
    if (
      application &&
      application.job_id.recruiter_id.toString() === recruiterId.toString()
    ) {
      application.status = "accepted";
      res
        .status(201)
        .json({ message: "Applicant successfully accepted", application });
    } else {
      res
        .status(400)
        .json({ message: "Unauthorized access to the application" });
    }
  } catch (err) {
    console.error(err);
    return res.status(404).send("Server error ", err);
  }
};

export {
  SignupRecruiter,
  LoginRecruiter,
  CreateJob,
  viewApplicants,
  updateJob,
  deleteJob,
  viewJobDetails,
  shortlistApplicants,
  rejectApplicants,
  acceptApplicants,
};
