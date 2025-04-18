const express = require('express');
const passport = require('passport');
const router = express.Router();
const Account = require('../models/account');

router.get('/', (req, res) => {
  res.render('index', { title: 'Artifact App', user: req.user });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  try {
    const existing = await Account.findOne({ username: req.body.username });
    if (existing) {
      return res.render('register', { title: 'Register', message: 'User already exists' });
    }

    const newAccount = new Account({ username: req.body.username });
    await Account.register(newAccount, req.body.password);
    res.redirect('/');
  } catch (err) {
    res.render('register', { title: 'Register', message: 'Error registering user' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/ping', (req, res) => {
  res.send('pong!');
});

module.exports = router;
