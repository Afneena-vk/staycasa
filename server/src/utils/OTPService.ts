import nodemailer from "nodemailer";

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

const sendOTP = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export default { generateOTP, sendOTP };
