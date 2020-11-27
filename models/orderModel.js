const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Please add a product name'],
  },
  qty: {
    type: Number,
    required: [true, 'Please add a product quantity'],
  },
  productImage: {
    type: String,
    required: [true, 'Please add a product image'],
  },
  price: {
    type: String,
    required: [true, 'Please add a product price'],
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const OrderSchema = new mongoose.Schema({
  orderItems: [orderItemSchema],
  itemsPrice: {
    type: Number,
    required: [true, 'Please add a Items price'],
  },
  orderStatus: {
    type: String,
    required: [true, 'A Order must have a order status'],
    enum: {
      values: ['Pending', 'Confimed', 'Cancelled'],
      message: 'Order status is either: All, Pending, Confimed, Cancelled',
    },
    default: 'Pending',
  },
  taxPrice: {
    type: Number,
    required: false,
  },
  discount: {
    type: Number,
    required: false,
  },
  shippingPrice: {
    type: Number,
    required: [true, 'Please add a shipping price'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add a total price'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
});

module.exports = mongoose.model('Order', OrderSchema);
