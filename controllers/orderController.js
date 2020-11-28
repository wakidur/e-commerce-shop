// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');

/**
 * Schema require list
 */
const Order = require('../models/orderModel');

exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Orders fetching Successfully',
    data: {
      orders: res.advanceResults,
    },
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const findOrder = await MongooseQuery.findById(Order, req.params.orderId, {
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
    message: 'Particular Order fetch Successfully',
    data: { order: findOrder },
  });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const newOrder = await MongooseQuery.create(Order, {
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'New Order Created',
    data: null,
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await MongooseQuery.findById(Order, req.params.orderId);

  if (!order)
    return next(
      new ErrorResponse(
        `Order is not found with id of ${req.params.orderId}`,
        404
      )
    );

  //check if order belongs to user created or user is admin

  const findOrder = await MongooseQuery.findOne(Order, {
    _id: req.params.orderId,
    userId: req.user._id,
  });

  if (!findOrder && req.user.role !== 'admin')
    return next(new ErrorResponse('Not authorized to update this review', 400));

  await MongooseQuery.findByIdAndUpdate(Order, req.params.orderId, req.body, {
    new: true,
    runValidators: true,
  });

  const updatedOrder = await MongooseQuery.findById(Order, req.params.orderId);

  res.status(200).json({
    status: 'success',
    message: 'Order updated Successfully',
    data: updatedOrder,
  });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await MongooseQuery.findById(Order, req.params.orderId);

  if (!order)
    return next(
      new ErrorResponse(
        `Order is not found with id of ${req.params.orderId}`,
        404
      )
    );
  //check if review belongs to user created or user is admin
  const findOrder = await MongooseQuery.findOne(Order, {
    _id: req.params.orderId,
    userId: req.user._id,
  });

  if (!findOrder && req.user.role !== 'admin')
    return next(new ErrorResponse('Not authorized to update this review', 400));

  await MongooseQuery.findByIdAndDelete(Order, req.params.orderId);

  res.status(204).json({
    status: 'success',
    message: 'Order Deleted Successfully',
    data: null,
  });
});
