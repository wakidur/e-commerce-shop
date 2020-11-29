// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const MongooseQuery = require('../utilities/mongoose-query');
const message = require('../utilities/message');

/**
 * Schema require list
 */
const PromoCode = require('../models/promoCodeModel');

const promoCodeInit = (req) => {
  return {
    promoCode: req.body.promoCode,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    discountRate: req.body.discountRate,
    useTime: req.body.useTime,
    active: req.body.active,
  };
};

const updatePromoCodeInit = (filteredBody) => {
  return {
    startDate: new Date(filteredBody.startDate),
    endDate: new Date(filteredBody.endDate),
    discountRate: filteredBody.discountRate,
    useTime: filteredBody.useTime,
    active: filteredBody.active,
  };
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getPromoCodes = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Promo Code fetching Successfully',
    data: {
      promocodes: res.advancedResults,
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
  // 1) check request body is empty!
  if (!req.body) {
    return next(new ErrorResponse(`${message.RequestBodyIsEmpty}`, 400));
  }
  // 2) Check same name promocode already exist or not
  const findbyName = await MongooseQuery.findOne(PromoCode, {
    promoCode: req.body.promoCode,
  });

  if (findbyName) {
    return next(new ErrorResponse('Same Promocode already exists', 400));
  }

  const promoCodeObj = promoCodeInit(req);
  const promoCode = await MongooseQuery.create(PromoCode, promoCodeObj);

  res.status(201).json({
    status: 'success',
    message: 'PromoCode  Create Successfully',
    data: { promocode: promoCode },
  });
});

exports.updatePromoCode = asyncHandler(async (req, res, next) => {
  // 1) check request body is empty!
  if (!req.body) {
    return next(new ErrorResponse(`${message.RequestBodyIsEmpty}`, 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'startDate',
    'endDate',
    'discountRate',
    'useTime',
    'active'
  );

  const updatePromocode = updatePromoCodeInit(filteredBody);
  const editPromoCode = await MongooseQuery.findByIdAndUpdate(
    PromoCode,
    req.params.promoCodeId,
    updatePromocode,
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
    data: {
      updatedPromoCode,
    },
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
        `PromoCode is not found with id of ${req.params.req.params.promoCodeId}`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    message: 'Category Deleted Successfully',
    data: null,
  });
});
