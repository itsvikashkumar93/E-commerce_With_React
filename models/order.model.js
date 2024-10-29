const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      required: true,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
