import nodemailer from "nodemailer";

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

const sendSignup = async (req, res) => {
  try {
    const { email } = req.body;
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Welcome to platform",
      text: `Hi you have successfully signed up`,
    });
  } catch (err) {
    console.log(err);
  }
};

const sendLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: "Login notification",
      text: `Hi you have successfully logged in`,
    });
  } catch (err) {
    console.log(err);
  }
};

export { sendSignup, sendLogin };
