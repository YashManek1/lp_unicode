const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const nodemailer = require("nodemailer");
env.config();
const Secret = process.env.SecretKey;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
  port: 465,
  secure: true,
});

const HandleGetAllUsers = async (req, res) => {
  try {
    const allDbUsers = await User.find();
    return res.status(200).json(allDbUsers);
  } catch (err) {
    return res.status(404);
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const NewUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: NewUser._id }, Secret, {
      expiresIn: "1h",
    });
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Welcome to platform",
      text: `Hi ${NewUser.username} you have successfully signed up`,
    });
    return res.status(201).json({ token, user: NewUser });
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
    const token = jwt.sign({ userId: user._id }, Secret, {
      expiresIn: "1h",
    });
    console.log("Transporter sendMail:", typeof transporter.sendMail);
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Login notification",
      text: `Hi ${user.username} you have successfully logged in`,
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Server error" });
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

module.exports = {
  HandleGetAllUsers,
  signup,
  login,
  HandleUpdateUsers,
  HandleDeleteUsers,
};
