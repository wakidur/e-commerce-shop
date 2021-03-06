/* eslint-disable consistent-return */

const ErrorResponse = require('../utilities/error-response');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  if (typeof err === 'string') {
    // custom application error
    const error = new ErrorResponse(err.message, 400);
    res.status(400).json({
      status: error.status,
      message: error.message,
    });
    // stop further execution in this callback
    return;
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    const message = 'Invalid Token';
    res.status(401).json({
      status: 401,
      error: message,
    });
    // stop further execution in this callback
    return;
  }
  if (err.isJoi) {
    // customize Joi validation errors
    err.message = err.details.map((e) => e.message).join('; ');
    err.status = 400;
    res.status(400).json({
      status: err.status,
      message: err.message,
    });
    // stop further execution in this callback
    return;
  }
  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    // eslint-disable-next-line prefer-const
    let valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).json({
      status: 422,
      message: valErrors,
    });
    // stop further execution in this callback
    return;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    // const message = 'Resource not found';
    const message = `Invalid ${err.path}: ${err.value}.`;
    res.status(400).json({
      status: 'fale',
      message: message,
    });
    // stop further execution in this callback
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    // const message = 'Duplicate field value entered';
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    res.status(400).json({
      status: 'fail',
      message,
    });
    // stop further execution in this callback
    return;
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Token Expired Error';
    res.status(500).json({
      status: 'error',
      message,
    });
    // stop further execution in this callback
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'invalid token';
    res.status(500).json({
      status: 'error',
      message,
    });
    // stop further execution in this callback
    return;
  }

  // default to 500 server error

  if (process.env.NODE_ENV === 'development') {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    return sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
