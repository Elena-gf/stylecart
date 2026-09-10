const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/orders", verifyToken, createOrder);
router.get("/orders/my-orders", verifyToken, getMyOrders);
router.get("/orders/:id", verifyToken, getOrderById);
router.get("/orders", verifyToken, verifyAdmin, getAllOrders);
router.patch("/orders/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;