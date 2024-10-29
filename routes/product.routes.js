const express = require("express");
const router = express.Router();
const productModel = require("../models/product.model");
const upload = require("../config/multer.config");
const authMiddleware = require("../middlewares/auth.middleware");
const productController = require("../controllers/product.controller.js");

router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);

router.post("/create-product", upload.any(), productController.createProduct);

module.exports = router;
