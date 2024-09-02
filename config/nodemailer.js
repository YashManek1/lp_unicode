const nodemailer = require("nodemailer");
const env = require("dotenv");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

module.exports = { transporter };
