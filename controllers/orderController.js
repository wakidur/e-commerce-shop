// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');
const message = require('../utilities/message');

/**
 * Schema require list
 */
const Order = require('../models/orderModel');
const PromoCodeUsesByUser = require('../models/promoCodeUsesByUserModel');

exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Orders fetching Successfully',
    data: {
      orders: res.advancedResults,
    },
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const findOrder = await MongooseQuery.findByIdAndPopulate(
    Order,
    req.params.orderId,
    {
      path: 'userId',
      select: 'uid phone role',
    }
  );

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
  // 1) check request body is empty!
  if (!req.body) {
    return next(new ErrorResponse(`${message.RequestBodyIsEmpty}`, 400));
  }
  // 2)  object destructuring
  const { role, _id } = req.user;
  const { promoCodeId } = req.body;

  // 3)  Create order
  const newOrder = await MongooseQuery.create(Order, {
    ...req.body,
    userId: _id,
  });

  // 4)  Check user has promocode and user role is "user"
  if (promoCodeId && role === 'user') {
    const createPromocodeUsesObj = {
      promoCodeId,
      userId: _id,
      usesCount: 1,
    };
    // 4.1)  find this user already use this promocode or not
    const promoCode = await MongooseQuery.findOne(PromoCodeUsesByUser, {
      userId: _id,
      promoCodeId: promoCodeId,
    });

    // 4.2) If already user this promocde then Update other wise create new one
    if (promoCode)
      await MongooseQuery.findByIdAndUpdate(
        PromoCodeUsesByUser,
        promoCode._id,
        { usesCount: promoCode.usesCount + 1 },
        {
          new: true,
          runValidators: true,
        }
      );
    else
      await MongooseQuery.create(PromoCodeUsesByUser, createPromocodeUsesObj);
  }

  res.status(201).json({
    status: 'success',
    message: 'New Order Created',
    data: {
      order: newOrder,
    },
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

  res.status(200).json({
    status: 'success',
    message: 'Order Deleted Successfully',
    data: null,
  });
});
