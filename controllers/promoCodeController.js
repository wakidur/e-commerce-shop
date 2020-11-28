// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');

/**
 * Schema require list
 */
const PromoCode = require('../models/promoCodeModel');

exports.getPromoCodes = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Promo Code fetching Successfully',
    data: {
      promocodes: res.advanceResults,
    },
  });
});

exports.getPromoCode = asyncHandler(async (req, res, next) => {
  const promoCode = await MongooseQuery.findById(
    PromoCode,
    req.params.promoCodeId
  );

  if (!promoCode)
    return next(
      new ErrorResponse(
        `PromoCode is not found with id of ${req.params.promoCodeId}`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    message: 'Promo Code fetch Successfully',
    data: { promocode: promoCode },
  });
});

exports.addPromoCode = asyncHandler(async (req, res, next) => {
  const promoCode = await MongooseQuery.create(PromoCode, req.body);

  res.status(201).json({
    status: 'success',
    message: 'PromoCode  Create Successfully',
    data: { promocode: promoCode },
  });
});

exports.updatePromoCode = asyncHandler(async (req, res, next) => {
  const editPromoCode = await MongooseQuery.findByIdAndUpdate(
    PromoCode,
    req.params.promoCodeId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editPromoCode)
    return next(
      new ErrorResponse(
        `PromoCode is not found with id of ${req.params.promoCodeId}`,
        404
      )
    );

  const updatedPromoCode = await MongooseQuery.findById(
    PromoCode,
    req.params.promoCodeId
  );

  res.status(201).json({
    status: 'success',
    message: 'Promo Code updated Successfully',
    data: null,
  });
});

exports.removePromoCode = asyncHandler(async (req, res, next) => {
  const findPromoCode = await MongooseQuery.findByIdAndDelete(
    PromoCode,
    req.params.promoCodeId
  );

  if (!findPromoCode)
    return next(
      new ErrorResponse(
        404,
        `PromoCode is not found with id of ${req.params.req.params.promoCodeId}`
      )
    );

  res.status(204).json({
    status: 'success',
    message: 'Category Deleted Successfully',
    data: null,
  });
});
