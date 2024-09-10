import nodemailer from "nodemailer";
import User from "../models/User.js";

const sendSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
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
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Welcome to platform",
      text: `Hi ${NewUser.username} you have successfully signed up`,
    });
  } catch (err) {
    console.log(err);
  }
};

const sendLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Login notification",
      text: `Hi ${user.username} you have successfully logged in`,
    });
  } catch (err) {
    console.log(err);
  }
};

export { sendSignup, sendLogin };
