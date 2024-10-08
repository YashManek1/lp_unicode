import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import cloudinary from "../config/cloudinary.js";
import { sendSignup, sendLogin } from "./nodemailer.js";

env.config();
const Secret = process.env.SecretKey;

const HandleGetAllUsers = async (req, res) => {
  try {
    const allDbUsers = await User.find();
    return res.status(200).json(allDbUsers);
  } catch (err) {
    return res.status(404);
  }
};

const HandleUpdateUsers = async (req, res) => {
  try {
    const Updateid = await User.findByIdAndUpdate(req.params.id, req.body);
    res.send(req.body);
    return res.json({ status: "Success" });
  } catch (err) {
    return res.status(404);
  }
};

const HandleDeleteUsers = async (req, res) => {
  try {
    const deleteid = await User.findByIdAndDelete(req.params.id);
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
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const resumeinput = await cloudinary.uploader.upload(req.file.path, {
      folder: "resume",
    });
    const NewUser = new User({
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
    const user = await User.findOne({ email });
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
    const user = await User.findById(req.user.userId);
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
    const user = await User.findById(req.user.userId);
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

export {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
  uploadprofilepic,
  updateprofilepic,
};

/* const Joi = require("@hapi/joi");

const SignupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(2).required(),
}).unknown(true); */
