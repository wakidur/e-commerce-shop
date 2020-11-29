const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product Name is required'],
      trim: true,
    },
    productImage: {
      type: String,
      required: [true, 'Image is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    discountRate: {
      type: Number,
      required: [false, 'Discount Rate is required'],
    },
    priceDiscount: {
      type: Number,
      required: false,
    },
    shippingCharge: {
      type: Number,
      required: [false, 'Shipping Charge is required'],
    },
    color: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

ProductSchema.index({ name: 1 });
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
ProductSchema.pre('save', function (next) {
  this.priceDiscount = ((this.discountRate / 100) * this.price).toFixed(2);
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
