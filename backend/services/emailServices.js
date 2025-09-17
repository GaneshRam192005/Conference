import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendApplyConfirmationEmail = async (email, name, userId, registrationId, paperTitle, allAuthors) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  // <h3 style="color: #2E86C1;">User ID: ${userId}</h3>

  const mailOptions = {
    from: `"NEC Conference" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Conference Registration Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2E86C1;">Conference Registration Received</h2>
        
        <h1 style="color: #fbff00ff; background-color: #ff0000ff;text-align: center;">Registration ID: ${registrationId}</h1>
        
       
        
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have successfully received your paper submission. Your registration has been confirmed with the above Paper ID.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #2E86C1; margin-top: 0;">Paper Details:</h3>
          <p><strong>Paper ID:</strong> ${registrationId}</p>
          <p><strong>Paper Title:</strong> ${paperTitle}</p>
          <p><strong>Created on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Authors:</strong> ${allAuthors.map(author => author.name).join(', ')}</p>
          <p><strong>Submission Files:</strong> Abstract document attached</p>
        </div>
        <p>Our team will review it and contact you soon.</p>
        <br>
        <p>Thanks</p>
        <p><strong>ICoDSES Team</strong></p>
      </div>
    `
  };

  // ✅ Only one sendMail call
  await transporter.sendMail(mailOptions);
};
