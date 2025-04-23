const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const accountSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  }
  // Password will be handled by passport-local-mongoose
});

// Add authentication-related methods and hash/salt support
accountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Account", accountSchema);
