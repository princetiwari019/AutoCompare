const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    salt: {
      type: String,
      required: [true, 'Salt is required']
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

// Helper method to hash password with salt
UserSchema.statics.hashPassword = function (password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

// Instance method to verify password
UserSchema.methods.matchPassword = function (enteredPassword) {
  const hash = crypto.pbkdf2Sync(enteredPassword, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.passwordHash === hash;
};

module.exports = mongoose.model('User', UserSchema);
