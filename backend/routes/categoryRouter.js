const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/categories", getAllCategories);
router.post("/categories", verifyToken, verifyAdmin, createCategory);
router.patch("/categories/:id", verifyToken, verifyAdmin, updateCategory);
router.delete("/categories/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;