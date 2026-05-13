import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Use App Password if needed
  }
});

const sendEmail = async (email, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Voting System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    });
    console.log(`✅ Email sent successfully to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};


export default sendEmail;

