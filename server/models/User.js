const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new Schema(
  {
    firstName: { type: String, min: 5, max: 50 },
    lastName: { type: String, min: 5, max: 50 },
    email: { type: String, require: true, unique: true, min: 5, max: 250 },
    password: { type: String, require: true, unique: true, min: 8, max: 1024 },
  },
  {
    timestamps: true,
  }
);

const userValidationSchema = {
  firstName: Joi.string().min(5).max(50),
  lastName: Joi.string().min(5).max(50),
  email: Joi.string().min(5).max(250).required().email(),
  password: Joi.string().min(8).max(1024).required(),
};

const validateUser = user => Joi.validate(user, userValidationSchema);
const User = model('User', userSchema);

module.exports = {
  userSchema,
  User,
  userValidationSchema,
  validateUser,
};
