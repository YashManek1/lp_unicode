import UserModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import cloudinary from "../config/cloudinary.js";
import JobModel from "../models/Job.js";
import ApplicationModel from "../models/Application.js";
import FollowerModel from "../models/follower.js";
import { sendSignup, sendLogin } from "./nodemailer.js";
import follower from "../models/follower.js";

env.config();
const Secret = process.env.SecretKey;

const HandleGetAllUsers = async (req, res) => {
  try {
    const allDbUsers = await UserModel.find();
    return res.status(200).json(allDbUsers);
  } catch (err) {
    return res.status(404);
  }
};

const HandleUpdateUsers = async (req, res) => {
  try {
    const Updateid = await UserModel.findByIdAndUpdate(req.params.id, req.body);
    res.send(req.body);
    return res.json({ status: "Success" });
  } catch (err) {
    return res.status(404);
  }
};

const HandleDeleteUsers = async (req, res) => {
  try {
    const deleteid = await UserModel.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      res.status(400).send();
    }
    res.send(deleteid);
  } catch (err) {
    return res.status(404);
  }
};

const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      resume,
      tech_stack,
      field_of_interest,
      experience_level,
      bio,
    } = req.body;
    const ExistingUser = await UserModel.findOne({ email });
    if (ExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const resumeinput = await cloudinary.uploader.upload(req.file.path, {
      folder: "resume",
    });
    const NewUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      resume: {
        resume_url: resumeinput.secure_url,
        public_id: resumeinput.public_id,
      },
      tech_stack: tech_stack.split(","),
      field_of_interest,
      experience_level,
      bio,
    });
    await NewUser.save();
    sendSignup(req, res);
    return res
      .status(201)
      .json({ message: "User successfully registered", user: NewUser });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({ userId: user._id }, Secret); //expiresIn:"1h"
    sendLogin(req, res);
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const uploadprofilepic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File not found");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilepics",
    });
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    user.profilePicture.url = result.secure_url;
    user.profilePicture.public_id = result.public_id;
    await user.save();
    return res.status(200).json({
      message: "User profile picture uploaded",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error uploading image");
  }
};

const updateprofilepic = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilepics",
    });
    user.profilePicture.url = result.secure_url;
    user.profilePicture.public_id = result.public_id;
    await user.save();
    return res.status(200).json({
      message: "User profile picture updated",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error updating image");
  }
};

const applyJob = async (req, res) => {
  try {
    const { job_title, status, applied_date, company_name, recruiter_id } =
      req.body;
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const job = await JobModel.findOne({
      title: job_title,
      company_name,
      recruiter_id,
    });
    if (!job) {
      return res.status(404).send("Job not found");
    }
    const newApplication = new ApplicationModel({
      user_id: user._id,
      job_id: job._id,
      status,
      applied_date,
    });
    await newApplication.save();
    return res.status(201).json({ Application: newApplication });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Server error", err });
  }
};

const follow = async (req, res) => {
  try {
    const { following_id, following_type } = req.body;
    console.log(following_type);
    if (!["User", "Company"].includes(following_type)) {
      return res.status(400).json({ message: "Following type is invalid" });
    }
    const followExists = await FollowerModel.findOne({
      follower_id: req.user.userId,
      following_id,
      following_type,
    });
    if (followExists) {
      return res.status(400).json({ message: "User is already following" });
    }
    const newFollow = new FollowerModel({
      follower_id: req.user.userId,
      following_id,
      following_type,
    });
    await newFollow.save();
    return res.status(201).json({
      message: `Successfully followed the ${following_type}`,
      Follow: newFollow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const unfollow = async (req, res) => {
  try {
    const { following_id, following_type } = req.body;
    const unfollow = await FollowerModel.findOneAndDelete({
      follower_id: req.user.userId,
      following_id,
      following_type,
    });
    if (!unfollow) {
      return res.status(400).json({ message: "User is already not following" });
    }
    return res
      .status(201)
      .json({ message: `Successfully unfollowed the ${following_type}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const getAllFollowers = async (req, res) => {
  try {
    const following_id = req.params.id;
    const followers = await FollowerModel.find({
      following_id: following_id,
    }).populate("follower_id", "username");
    return res.status(201).send(followers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const getAllFollowing = async (req, res) => {
  try {
    const following = await FollowerModel.find({
      follower_id: req.user.userId,
    }).populate("following_id", "username following_type");
    return res.status(201).send(following);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

export {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
  uploadprofilepic,
  updateprofilepic,
  applyJob,
  follow,
  unfollow,
  getAllFollowers,
  getAllFollowing,
};
