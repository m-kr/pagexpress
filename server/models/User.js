const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const roles = require('../roles/roles');

const userSchema = new Schema(
  {
    username: { type: String, require: true, unique: true, min: 5, max: 50 },
    email: { type: String, require: true, unique: true, min: 5, max: 250 },
    password: { type: String, require: true, unique: true, min: 8, max: 1024 },
    role: { type: String, default: roles.REDACTOR, enum: Object.values(roles) },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    config.get('jwtPrivateKey')
  );
};

const userValidationSchema = Joi.object({
  username: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(250).required().email(),
  password: Joi.string().min(8).max(50).required(),
  role: Joi.string().valid(Object.values(roles).join(', ')),
});

const User = model('User', userSchema);

module.exports = {
  userSchema,
  User,
  userValidationSchema,
};
