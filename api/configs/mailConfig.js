// configs/mailConfig.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const mailConfig = async (toemls, ccemls, bccemls, subjct, maildtl) => {
  const from_name = `Shyam Metalics`;
  const from_email = process.env.EMAIL_USR;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: "outlook",
    secure: false,
    auth: {
      user: process.env.EMAIL_USR,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `${from_name} <${from_email}>`,
    to: toemls?.join(","),
    cc: ccemls?.join(","),
    bcc: bccemls?.join(","),
    subject: subjct,
    html: maildtl,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("📨 Mail sent:", info.response);
  return info;
};
