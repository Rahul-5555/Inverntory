const express = require("express");
const productController = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 🔍 DEBUG (do NOT remove yet)
console.log("protect type:", typeof protect);
console.log("addProduct type:", typeof productController.addProduct);

router.post("/", protect, productController.addProduct);
router.get("/", protect, productController.getProducts);
router.put("/:id", protect, productController.updateProduct);
router.delete("/:id", protect, productController.deleteProduct);

module.exports = router;
