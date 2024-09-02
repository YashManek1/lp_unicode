const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const Secret = process.env.SecretKey;
const transporter = require("../config/nodemailer");

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
      return res.json.send("User already exists");
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const NewUser = await User.create({
      username,
      email,
      password: hasedPassword,
    });

    const token = jwt.sign({ userId: NewUser._id }, Secret, {
      expiresIn: "1h",
    });
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Welcome to platform",
      text: `Hi ${username} you have successfully signed up`,
    });
    return res.status(201).json({ token, user: NewUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await User.findOne({ email });
    if (!User) {
      return res.status(400).json.send("Invalid email or password");
    }
    const match = await bcrypt.compare(password, User.password);
    if (!match) {
      return res.status(400).json.send("Invalid password");
    }
    const token = jwt.sign({ userId: User._id }, Secret, {
      expiresIn: "1h",
    });
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Login notification",
      text: `Hi ${username} you have successfully logged in`,
    });
    return res.status(200).json({ token, User});
  } catch (err) {
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
