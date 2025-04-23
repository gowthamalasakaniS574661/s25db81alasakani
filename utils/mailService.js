const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'a60f16f37be51b',
    pass: 'your_password_here'  // Replace with full visible password from Mailtrap
  }
});

const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: '"Artifact OTP" <no-reply@artifact.com>',
    to,
    subject: 'Your Artifact OTP Code',
    html: `<h2>🧾 Verify your Email</h2><p>Your OTP code is <b>${otp}</b></p>`
  });
};

module.exports = { sendOTPEmail };
