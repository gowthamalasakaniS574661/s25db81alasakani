require('dotenv').config();
const mongoose = require('mongoose');
const Account = require('./models/account');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CON)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    return Account.findOne({ username: 'GowthamAlasakani' });
  })
  .then(existingUser => {
    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.username);
      return mongoose.connection.close();
    }

    // Register new user if not exists
    return Account.register(
      new Account({ username: 'GowthamAlasakani' }),
      '1234'
    ).then(user => {
      console.log('✅ User registered:', user.username);
      return mongoose.connection.close();
    });
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.connection.close();
  });
