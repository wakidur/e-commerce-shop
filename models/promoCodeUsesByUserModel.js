const mongoose = require('mongoose');

const PromoCodeUsesByUserSchema = new mongoose.Schema({
  promoCodeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'PromoCode',
    required: [true, 'PromoCode must belong to a Tour!'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Promo code must belong to a User!'],
  },
  usesCount: {
    type: Number,
    require: [true, 'Promo code must have'],
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

PromoCodeUsesByUserSchema.pre(/^find/, function (next) {
  this.populate('userId').populate('promoCodeId');
  next();
});

module.exports = mongoose.model(
  'PromoCodeUsesByUser',
  PromoCodeUsesByUserSchema
);
