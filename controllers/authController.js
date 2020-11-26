/**
 * Node Core Modules
 */
const crypto = require('crypto');

/**
 * 3th party dependencies Modules from the npm .
 */

const passport = require('passport');
const Joi = require('joi');
const _ = require('lodash');

// Own Middleware and dependency
const asyncHandler = require('../../middleware/async-middleware');
const ErrorResponse = require('../../utilities/error-response');
const MongooseQuery = require('../../utilities/mongoose-query');
const Message = require('../../utilities/message');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, req, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  // cookieOptions
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('jwt', token, options);

  return res.status(statusCode).json({
    status: 'success',
    token,
  });
};

exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendTokenResponse(newUser, 201, req, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  sendTokenResponse(user, 200, req, res);
});
