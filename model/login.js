const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  picture: String,
}, { timestamps: true });


const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});


const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = {
  User,
  Session
};