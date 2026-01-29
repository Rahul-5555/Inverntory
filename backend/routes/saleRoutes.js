const express = require("express");
const { recordSale, getTodaySales, getTotalProfit } = require("../controllers/saleController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, recordSale);
router.get("/today", protect, getTodaySales);
router.get("/profit", protect, getTotalProfit);

module.exports = router;
