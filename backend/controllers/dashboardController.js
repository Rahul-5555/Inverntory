const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.getDashboardSummary = async (req, res) => {
  try {
    // 1️⃣ Total products
    const totalProducts = await Product.countDocuments({
      userId: req.user.id,
    });

    // 2️⃣ Low stock products
    const lowStock = await Product.countDocuments({
      userId: req.user.id,
      $expr: { $lt: ["$quantity", "$minStock"] },
    });

    // 3️⃣ Today sales count
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todaySales = await Sale.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: start, $lte: end },
    });

    // 4️⃣ Total profit
    const profitResult = await Sale.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" },
        },
      },
    ]);

    const totalProfit = profitResult[0]?.totalProfit || 0;

    res.json({
      totalProducts,
      lowStock,
      todaySales,
      totalProfit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
