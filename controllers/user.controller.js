const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const productModel = require("../models/product.model");
const paymentModel = require("../models/payment.model");
const orderModel = require("../models/order.model");
require("dotenv").config();
const Razorpay = require("razorpay");
const {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    next(error);
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ message: "User signed in successfully", user, token });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const blacklistToken = await blacklistModel.findOne({ token });
    if (blacklistToken) {
      return res.status(400).json({ message: "Token is already blacklisted" });
    }
    await blacklistModel.create({ token });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    next(error);
  }
};

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

module.exports.createOrder = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    const options = {
      amount: product.price * 100,
      currency: "INR",
      receipt: product._id,
    };
    const order = await instance.orders.create(options);

    const payment = await paymentModel.create({
      orderId: order.id,
      amount: product.price,
      currency: "INR",
      status: "pending",
    });

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

module.exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const isValid = validatePaymentVerification(
      {
        order_id: orderId,
        payment_id: paymentId,
      },
      signature,
      secret
    );
    if (isValid) {
      const payment = await paymentModel.findOne({ orderId });
      payment.paymentId = paymentId;
      payment.signature = signature;
      payment.status = "success";
      await payment.save();
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      const payment = await paymentModel.findOne({ orderId });
      payment.status = "failed";
      await payment.save();
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    next(error);
  }
};
