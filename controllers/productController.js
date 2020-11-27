/**
 * Node Core Modules
 */
const path = require('path');
/**
 * 3rd party modules from npm.
 */
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Own Middleware and dependency
const asyncHandler = require('../middleware/async-middleware');
const ErrorResponse = require('../utilities/error-response');
const mongooseQuery = require('../utilities/mongoose-query');
const Message = require('../utilities/message');

/**
 * Schema require list
 */
const Product = require('../models/productModel');
const { isMongoDBObjectID } = require('../service/utilityService');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer Store memoryStorage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse('Not an image! Please upload only images.', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('productImage');

exports.getProducts = asyncHandler(async (req, res, next) => {
  const { keyWord } = req.query;

  if (keyWord) {
    const searchItem = keyWord
      ? { name: { $regex: keyWord, $options: 'i' } }
      : {};

    const searchProduct = await mongooseQuery.find(Product, searchItem);

    res.status(200).json({
      status: 'success',
      message: 'Products fetching Successfully',
      data: {
        products: searchProduct,
        count: searchProduct.length,
      },
    });
  } else {
    res.status(200).json({
      status: 'success',
      message: 'Products fetching Successfully',
      data: {
        products: res.advanceResults,
      },
    });
  }
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const isValidID = await isMongoDBObjectID(req.params.productId);
  if (!isValidID) {
    return next(new ErrorResponse(`${Message.THIS_IN_VALID_MONGODB_ID}`, 400));
  }

  const product = await mongooseQuery.findById(Product, req.params.productId);

  if (!product)
    return next(
      new ErrorResponse(
        404,
        `Product is not found with id of ${req.params.productId}`
      )
    );

  res.status(200).json({
    status: 'success',
    message: 'Particular Product fetch Successfully',
    data: { product },
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  if (!req.files) return next(new ErrorResponse(400, 'Please add a photo'));

  console.log(req.files);

  const file = req.files.productImage;

  //Check file type
  if (!file.mimetype.startsWith('image'))
    return next(new ErrorResponse(400, 'This file is not supported'));

  //Check file size
  if (file.size > process.env.FILE_UPLOAD_SIZE)
    return next(
      new ErrorResponse(
        400,
        `Please upload a image of size less than ${process.env.FILE_UPLOAD_SIZE}`
      )
    );

  cloudinary.uploader.upload(
    file.tempFilePath,
    { use_filename: true, folder: 'products' },
    async function (error, result) {
      if (error)
        return next(new ErrorResponse(409, 'failed to create product'));
      const product = await Product.create({
        ...req.body,
        productImage: result.url,
      });
      res.status(200).json({
        status: 'success',
        message: 'Product Create Successfully',
        data: { product },
      });
    }
  );
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const editProduct = await mongooseQuery.findByIdAndUpdate(
    Product,
    req.params.productId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editProduct)
    return next(
      new ErrorResponse(
        404,
        `Product is not found with id of ${req.params.productId}`
      )
    );

  const updatedProduct = await Product.findById(req.params.productId);

  res.status(201).json({
    status: 'success',
    message: 'Product Updated Successfully',
    data: { updatedProduct },
  });
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const deleteProduct = await mongooseQuery.findByIdAndDelete(
    Product,
    req.params.productId
  );

  if (!deleteProduct)
    return next(
      new ErrorResponse(
        404,
        `User is not found with id of ${req.params.productId}`
      )
    );
  res.status(204).json({
    status: 'success',
    message: 'Product Deleted Successfully',
    data: null,
  });
});
