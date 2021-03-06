/**
 * Node Core Modules
 */
const path = require('path');

/**
 * 3rd party modules from npm.
 */

const express = require('express');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config({ path: 'config.env' });
// Globale Error Handler
const globalErrorHandler = require('./middleware/error-handler');
// Database connection
const connectDB = require('./config/db-config');

// Error Response Class
const ErrorResponse = require('./utilities/error-response');
/**
 * route handlers files.
 */
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const promoCodeRouter = require('./routes/promoCodeRoutes');
const orderRouter = require('./routes/orderRoutes');
const promoCodeUsesRouter = require('./routes/promoCodeUsesByUserRoutes');
/**
 * Create Express server.
 */
const app = express();

// Database Connect instantiate
connectDB();

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// Set security HTTP headers
app.use(helmet());
// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());
// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' })); // Make sure the body is parsed beforehand.
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// Prevent parameter pollution
app.use(hpp()); // <- THIS IS THE NEW LINE
// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/promocode', promoCodeRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/promocodeuses', promoCodeUsesRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Error Handling Middlewar, error handler, send stacktrace only during development
app.use(globalErrorHandler);

module.exports = app;
