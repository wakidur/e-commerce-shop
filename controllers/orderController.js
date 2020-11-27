/**

/**
 * 3th party dependencies Modules from the npm .
 */
const Joi = require('joi');

// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');
const Message = require('../utilities/message');

/**
 * Schema require list
 */
const Order = require('../models/orderModel');

exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Promo Code fetching Successfully',
    data: {
      orders: res.advanceResults,
    },
  });
});

exports.authOrder = asyncHandler(async (req, res, next) => {
  const authOrders = await Order.find({ userId: req.user._id });
  return res.status(200).send({
    status: 'success',
    count: authOrders.length,
    data: authOrders,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const findOrder = await Order.findById(req.params.orderId).populate({
    path: 'userId',
    select: 'name email',
  });

  if (!findOrder)
    return next(
      new ErrorResponse(
        `Order is not found with id of ${req.params.orderId}`,
        404
      )
    );

  res.status(200).send({
    status: 'success',
    data: findOrder,
  });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const newOrder = await Order.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).send({
    status: 'success',
    message: 'New Order Created',
    data: { newOrder },
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order)
    return next(
      new ErrorResponse(
        `Order is not found with id of ${req.params.orderId}`,
        404
      )
    );

  //check if order belongs to user created or user is admin

  const findOrder = await Order.findOne({
    _id: req.params.orderId,
    userId: req.user._id,
  });

  if (!findOrder && req.user.role !== 'admin')
    return next(new ErrorResponse('Not authorized to update this review', 400));

  await Order.findByIdAndUpdate(req.params.orderId, req.body, {
    new: true,
    runValidators: true,
  });

  const updatedOrder = await Order.findById(req.params.orderId);

  res.status(200).send({ status: 'success', data: updatedOrder });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order)
    return next(
      new ErrorResponse(
        `Order is not found with id of ${req.params.orderId}`,
        404
      )
    );

  //check if review belongs to user created or user is admin
  const findOrder = await Order.findOne({
    _id: req.params.orderId,
    userId: req.user._id,
  });

  if (!findOrder && req.user.role !== 'admin')
    return next(new ErrorResponse('Not authorized to update this review', 400));

  await Order.findByIdAndDelete(req.params.orderId);

  res
    .status(204)
    .send({ status: 'success', message: 'Order Deleted Successfully' });
});
