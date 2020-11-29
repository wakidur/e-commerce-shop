/**
 * 3rd party modules from npm.
 */
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require('sharp');
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

exports.resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.file.filename}`);

  next();
});

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
        products: res.advancedResults,
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
        `Product is not found with id of ${req.params.productId}`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    message: 'Particular Product fetch Successfully',
    data: { product },
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  if (!req.files) return next(new ErrorResponse('Please add a photo', 400));

  const file = req.files.productImage;

  //Check file type
  if (!file.mimetype.startsWith('image'))
    return next(new ErrorResponse('This file is not supported', 400));

  //Check file size
  if (file.size > process.env.FILE_UPLOAD_SIZE)
    return next(
      new ErrorResponse(
        `Please upload a image of size less than ${process.env.FILE_UPLOAD_SIZE}`,
        400
      )
    );

  cloudinary.uploader.upload(
    file.tempFilePath,
    {
      resource_type: 'image',
      use_filename: true,
      folder: 'products',
      eager: [
        {
          width: 500,
          height: 500,
          crop: 'fill',
        },
      ],
      eager_async: true,
    },
    async function (error, result) {
      if (error)
        return next(new ErrorResponse('failed to create product', 409));
      const product = await Product.create({
        ...req.body,
        productImage: result.eager[0].url,
      });
      res.status(201).json({
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

  const updatedProduct = await mongooseQuery.findById(
    Product,
    req.params.productId
  );

  res.status(201).json({
    status: 'success',
    message: 'Product Updated Successfully',
    data: { product: updatedProduct },
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
        `User is not found with id of ${req.params.productId}`,
        404
      )
    );

  return res.status(200).json({
    status: 'success',
    message: 'Product Deleted Successfully',
    data: null,
  });
});
