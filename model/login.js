const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  picture: String,
}, { timestamps: true });

// 🔹 Session Schema
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

// 🔹 Export both
const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = {
  User,
  Session
};