const Sale = require("../models/Sale");
const Product = require("../models/Product");

// ➕ RECORD SALE
exports.recordSale = async (req, res) => {
  const { productId, quantitySold } = req.body;

  if (!productId || !quantitySold) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 🔐 Ownership check
  if (product.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ❌ Stock check
  if (product.quantity < quantitySold) {
    return res.status(400).json({
      message: "Insufficient stock",
    });
  }

  // 💰 Profit calculation
  const profit =
    (product.sellingPrice - product.buyingPrice) * quantitySold;

  // 🧾 Save sale
  const sale = await Sale.create({
    userId: req.user.id,
    productId,
    quantitySold,
    sellingPrice: product.sellingPrice,
    buyingPrice: product.buyingPrice,
    profit,
  });

  // 📉 Update stock
  product.quantity -= quantitySold;
  await product.save();

  res.status(201).json({
    message: "Sale recorded successfully",
    sale,
    updatedStock: product.quantity,
  });
};

exports.getTodaySales = async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const sales = await Sale.find({
    userId: req.user.id,
    createdAt: { $gte: start, $lte: end },
  });

  res.json(sales);
};


exports.getTotalProfit = async (req, res) => {
  const result = await Sale.aggregate([
    { $match: { userId: req.user.id } },
    {
      $group: {
        _id: null,
        totalProfit: { $sum: "$profit" },
      },
    },
  ]);

  res.json({
    totalProfit: result[0]?.totalProfit || 0,
  });
};
