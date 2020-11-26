const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema(
  {
    promoCode: {
      type: String,
      required: [true, 'Promo Code is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start Date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End Date is required'],
    },
    discountRate: {
      type: Number,
      required: [true, 'Discount Rate is required'],
    },
    useTime: {
      type: Number,
      required: [true, 'Use Time is required'],
    },
    active: {
      type: Boolean,
      default: false,
      select: false,
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

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
