const Product = require("../models/Product");

// ➕ ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      buyingPrice,
      sellingPrice,
      quantity,
      minStock,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || buyingPrice == null || sellingPrice == null || quantity == null) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await Product.create({
      userId: req.user.id,
      name,
      category,
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
      minStock: minStock ? Number(minStock) : undefined,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ✅ SINGLE, CLEAR EXPORT */
module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
