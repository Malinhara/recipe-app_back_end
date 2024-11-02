const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true }, 
  Favitem: [{ type: String, required: true }],
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
