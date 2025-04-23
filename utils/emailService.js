const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function sendOtpEmail({ to, otp }) {
  const mailOptions = {
    from: `"Artifact OTP" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Verify Your Artifact Account',
    html: `
      <div style="font-family:sans-serif;">
        <h2>Your OTP is: <span style="color:#007bff">${otp}</span></h2>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
