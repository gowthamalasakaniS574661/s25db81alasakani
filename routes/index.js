const express = require('express');
const passport = require('passport');
const router = express.Router();
const Account = require('../models/account');
const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/emailService');

const otpMap = new Map(); // In-memory OTP store

// ------------------ 🏠 Home ------------------
router.get('/', (req, res) => {
  res.render('index', { title: 'Artifact App', user: req.user });
});

// ------------------ 📝 Register ------------------
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.render('register', { title: 'Register', message: 'All fields are required.' });
  }

  const existing = await Account.findOne({ username });
  if (existing) return res.render('register', { title: 'Register', message: 'User already exists.' });

  const otp = crypto.randomInt(100000, 999999).toString();
  otpMap.set(username, { otp, password, email, createdAt: Date.now() });

  try {
    await sendOtpEmail({ to: email, otp });
    return res.render('verify', { title: 'Verify OTP', username });
  } catch (err) {
    return res.render('register', { title: 'Register', message: 'Failed to send OTP.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { username, otp: userOtp } = req.body;
  const entry = otpMap.get(username);
  if (!entry || Date.now() - entry.createdAt > 5 * 60 * 1000) {
    otpMap.delete(username);
    return res.render('register', { title: 'Register', message: 'OTP expired. Please register again.' });
  }

  if (userOtp !== entry.otp) {
    return res.render('verify', { title: 'Verify OTP', username, message: '❌ Invalid OTP. Try again.' });
  }

  try {
    const newAccount = new Account({ username, email: entry.email });
    await Account.register(newAccount, entry.password);
    otpMap.delete(username);
    res.redirect('/login');
  } catch (err) {
    res.render('register', { title: 'Register', message: 'Error creating account.' });
  }
});

// ------------------ 🔐 Login & OTP ------------------
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err || !user) return res.render('login', { title: 'Login', message: 'Invalid credentials' });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpMap.set(user.username, { otp, createdAt: Date.now() });

    try {
      await sendOtpEmail({ to: user.email, otp });
      req.session.pendingUser = user.username;
      return res.redirect('/otp');
    } catch {
      return res.render('login', { title: 'Login', message: 'OTP email failed. Try again.' });
    }
  })(req, res, next);
});

router.get('/otp', (req, res) => {
  if (!req.session.pendingUser) return res.redirect('/login');
  res.render('otp', { title: 'Enter OTP' });
});

router.post('/otp', async (req, res) => {
  const { otp } = req.body;
  const username = req.session.pendingUser;
  const entry = otpMap.get(username);

  if (!entry || Date.now() - entry.createdAt > 5 * 60 * 1000 || otp !== entry.otp) {
    otpMap.delete(username);
    return res.render('otp', { title: 'Enter OTP', message: '❌ Invalid or expired OTP.' });
  }

  const user = await Account.findOne({ username });
  req.login(user, (err) => {
    if (err) return res.redirect('/login');
    otpMap.delete(username);
    delete req.session.pendingUser;
    res.redirect('/artifacts');
  });
});

// ✅ Resend OTP
router.get('/resend-otp', async (req, res) => {
  const username = req.session.pendingUser;
  if (!username) return res.redirect('/login');

  const user = await Account.findOne({ username });
  if (!user) return res.redirect('/login');

  const otp = crypto.randomInt(100000, 999999).toString();
  otpMap.set(username, { otp, createdAt: Date.now() });

  try {
    await sendOtpEmail({ to: user.email, otp });
    res.render('otp', { title: 'Enter OTP', message: '✅ OTP resent successfully!' });
  } catch {
    res.render('otp', { title: 'Enter OTP', message: '❌ Failed to resend OTP.' });
  }
});

// ------------------ 🔁 Forgot Password ------------------
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await Account.findOne({ email });
  if (!user) {
    return res.render('forgot-password', { title: 'Forgot Password', message: 'Email not found.' });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  otpMap.set(user.username, { otp, createdAt: Date.now(), reset: true });

  try {
    await sendOtpEmail({ to: email, otp });
    req.session.resetUser = user.username;
    res.redirect('/reset-password');
  } catch {
    res.render('forgot-password', { title: 'Forgot Password', message: 'Failed to send OTP.' });
  }
});

router.get('/reset-password', (req, res) => {
  if (!req.session.resetUser) return res.redirect('/login');
  res.render('reset-password', { title: 'Reset Password' });
});

router.post('/reset-password', async (req, res) => {
  const { otp, newPassword } = req.body;
  const username = req.session.resetUser;
  const entry = otpMap.get(username);

  if (!entry || !entry.reset || Date.now() - entry.createdAt > 5 * 60 * 1000 || otp !== entry.otp) {
    return res.render('reset-password', { title: 'Reset Password', message: 'Invalid or expired OTP.' });
  }

  const user = await Account.findOne({ username });
  await user.setPassword(newPassword);
  await user.save();

  otpMap.delete(username);
  delete req.session.resetUser;
  res.redirect('/login');
});

// ------------------ 👤 Update Profile ------------------
router.get('/profile', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('profile', { title: 'Update Profile', user: req.user });
});

router.post('/profile', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  const { email, password } = req.body;

  const user = await Account.findById(req.user._id);
  if (email) user.email = email;
  if (password) await user.setPassword(password);
  await user.save();

  res.render('profile', { title: 'Update Profile', user, message: '✅ Profile updated successfully!' });
});

// ------------------ 🚪 Logout ------------------
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
