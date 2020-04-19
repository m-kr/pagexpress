const { Schema, model } = require('mongoose');

const userSchema = Schema(
  {
    firstName: { type: String, min: 5, max: 50 },
    lastName: { type: String, min: 5, max: 50 },
    email: { type: String, require: true, unique: true, min: 5, max: 250 },
    password: { type: String, require: true, unique: true, min: 6, max: 1024 },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = {
  userSchema,
  User,
};
