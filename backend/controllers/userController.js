const userModel = require("../models/userModel");
const productModel = require("../models/productModel");


const getCart = async (req, res) => {
  try {
    const userId = req.payload._id;
    const user = await userModel.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).send({ status: "Failed", message: "Usuario no encontrado" });
    }

    res.status(200).send({ status: "Success", data: user.cart });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).send({ status: "Failed", message: "Falta el productId" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send({ status: "Failed", message: "Producto no encontrado" });
    }

    const qty = quantity || 1;
    if (product.stock < qty) {
      return res.status(400).send({ status: "Failed", message: "No hay stock suficiente" });
    }

    const user = await userModel.findById(userId);
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();
    const updatedUser = await userModel.findById(userId).populate("cart.product");

    res.status(200).send({ status: "Success", data: updatedUser.cart });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).send({ status: "Failed", message: "La cantidad debe ser al menos 1" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: "Failed", message: "Usuario no encontrado" });
    }

    const item = user.cart.id(itemId);
    if (!item) {
      return res.status(404).send({ status: "Failed", message: "Item no encontrado en el carrito" });
    }

    item.quantity = quantity;
    await user.save();

    const updatedUser = await userModel.findById(userId).populate("cart.product");
    res.status(200).send({ status: "Success", data: updatedUser.cart });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { itemId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: "Failed", message: "Usuario no encontrado" });
    }

    const item = user.cart.id(itemId);
    if (!item) {
      return res.status(404).send({ status: "Failed", message: "Item no encontrado en el carrito" });
    }

    item.deleteOne();
    await user.save();

    res.status(200).send({ status: "Success", message: "Item eliminado del carrito" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};


const editData = async (req, res) => {
  try {
    const userId = req.payload._id;
    const newData = req.body;

    
    delete newData.password;
    delete newData.role;
    delete newData.cart;

    const user = await userModel.findByIdAndUpdate(userId, newData, { new: true });

    if (!user) {
      return res.status(404).send({ status: "Failed", message: "Usuario no encontrado" });
    }

    res.status(200).send({ status: "Success", data: user });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, editData };