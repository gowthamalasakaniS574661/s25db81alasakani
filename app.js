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
// 🧠 Passport & Session Setup
// -------------------------------
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport strategy
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// -------------------------------
// 🖼️ View Engine
// -------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// -------------------------------
// 🚦 Routes
// -------------------------------
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/artifacts', artifactsRouter); // Main CRUD route
app.use('/grid', gridRouter);
app.use('/pick', pickRouter);
app.use('/resource', resourceRouter);   // REST API access

// -------------------------------
// ❌ 404 & Error Handling
// -------------------------------
app.use((req, res, next) => {
  next(createError(404, 'Page Not Found'));
});

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
