const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new Schema(
  {
    email: { type: String, require: true, unique: true, min: 5, max: 250 },
    password: { type: String, require: true, unique: true, min: 8, max: 1024 },
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
    },
    config.get('jwtPrivateKey')
  );
};

const userValidationSchema = Joi.object({
  email: Joi.string().min(5).max(250).required().email(),
  password: Joi.string().min(8).max(50).required(),
});

const User = model('User', userSchema);

module.exports = {
  userSchema,
  User,
  userValidationSchema,
};
