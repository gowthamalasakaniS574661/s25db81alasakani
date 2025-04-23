require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('./models/account');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const artifactsRouter = require('./routes/artifacts');
const gridRouter = require('./routes/grid');
const pickRouter = require('./routes/pick');
const resourceRouter = require('./routes/resource');

const app = express();

// -------------------------------
// 🗃️ MongoDB Connection
// -------------------------------
const connectionString = process.env.MONGO_CON;
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB Error:'));
db.once('open', () => console.log("✅ DB Connection Open"));
db.on('disconnected', () => console.log("⚠️ MongoDB Disconnected"));

// -------------------------------
// ⚙️ Middleware
// -------------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// -------------------------------
// 🔐 Passport & Sessions
// -------------------------------
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// 🔄 Make user available in views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// -------------------------------
// 🖼️ View Engine Setup
// -------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// -------------------------------
// 🌐 Routes
// -------------------------------
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/artifacts', artifactsRouter);
app.use('/grid', gridRouter);
app.use('/pick', pickRouter);
app.use('/resource', resourceRouter);

// -------------------------------
// 🔐 Auth Routes
// -------------------------------
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// -------------------------------
// ❌ 404 Futuristic Page
// -------------------------------
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: "404 - Not Found",
    message: "Looks like you're lost in space...",
    image: "/images/404futuristic.png"
  });
});

// -------------------------------
// 🌐 Global Error Handler
// -------------------------------
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);

  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/resource')) {
    return res.json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  res.render('error');
});

// -------------------------------
// 🛑 Graceful Shutdown
// -------------------------------
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed. Shutting down...');
  process.exit(0);
});

module.exports = app;
