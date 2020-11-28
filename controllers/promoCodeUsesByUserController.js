// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');

/**
 * Schema require list
 */
const PromoCodeUsesByUser = require('../models/promoCodeUsesByUserModel');

exports.getPromoCodeUsesByUser = asyncHandler(async (req, res, next) => {
  const promoCode = await MongooseQuery.findOne(PromoCodeUsesByUser, {
    userId: req.params.userId,
    promoCodeId: req.params.promoCodeId,
  });

  if (!promoCode)
    return next(new ErrorResponse('PromoCode is not found with id of', 404));

  res.status(200).json({
    status: 'success',
    message: 'Promo Code Uses By User fetch Successfully',
    data: { promocodeuses: promoCode },
  });
});

exports.addPromoCodeUsesByUser = asyncHandler(async (req, res, next) => {
  const promoCode = await MongooseQuery.create(PromoCodeUsesByUser, req.body);

  res.status(201).json({
    status: 'success',
    message: 'Promo Code Uses By User Create Successfully',
    data: { promocodeuses: promoCode },
  });
});

exports.updatePromoCodeUsesByUser = asyncHandler(async (req, res, next) => {
  const editPromoCode = await MongooseQuery.findByIdAndUpdate(
    PromoCodeUsesByUser,
    req.params.promoCodeUsesId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editPromoCode)
    return next(
      new ErrorResponse(
        `PromoCode is not found with id of ${req.params.promoCodeUsesId}`,
        404
      )
    );

  const updatedPromoCode = await MongooseQuery.findById(
    PromoCodeUsesByUser,
    req.params.promoCodeUsesId
  );

  res.status(201).json({
    status: 'success',
    message: 'Promo Code Uses ByUser updated Successfully',
    data: { updatedPromoCodeUses: updatedPromoCode },
  });
});
