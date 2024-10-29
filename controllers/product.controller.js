const productModel = require("../models/product.model");

module.exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const images = req.files.map((file) => file.publicUrl);

    // console.log(images);

    if (!name || !description || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      images,
      seller: req.user._id,
    });

    return res.status(200).json({
      message: "Product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
