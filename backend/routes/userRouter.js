const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  editData,
} = require("../controllers/userController");

router.get("/user/cart", verifyToken, getCart);
router.post("/user/cart", verifyToken, addToCart);
router.patch("/user/cart/:itemId", verifyToken, updateCartItem);
router.delete("/user/cart/:itemId", verifyToken, removeFromCart);
router.patch("/user", verifyToken, editData);

module.exports = router;