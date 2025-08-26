const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendApplyConfirmationEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"NEC Recruitment Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Application Confirmation - NEC Faculty Recruitment",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #2E86C1;">Faculty Recruitment - Application Received</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for the interest. We have received your application successfully.</p>
        <p>Our recruitment team will review your application and contact you soon. Please ensure that your registered email address remains active for future communications.</p>
        <p>We appreciate your interest in joining NEC and wish you all the best in the recruitment process.</p>
        <p>This is an auto-generated email. Kindly please do not reply to this message.</p>
        <br>
        <p>Warm regards,</p>
        <p><strong>National Engineering College</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendApplyConfirmationEmail };