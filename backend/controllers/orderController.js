const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

// Crea un pedido a partir del carrito actual del usuario
const createOrder = async (req, res) => {
  try {
    const userId = req.payload._id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).send({ status: "Failed", message: "Falta la dirección de envío" });
    }

    const user = await userModel.findById(userId);
    if (!user || user.cart.length === 0) {
      return res.status(400).send({ status: "Failed", message: "El carrito está vacío" });
    }

    // PRIMERA PASADA: validar todo antes de tocar nada
    const products = [];
    for (const cartItem of user.cart) {
      const product = await productModel.findById(cartItem.product);
      if (!product) {
        return res.status(404).send({ status: "Failed", message: "Un producto del carrito ya no existe" });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).send({
          status: "Failed",
          message: `Sin stock suficiente para ${product.name}`,
        });
      }
      products.push({ product, quantity: cartItem.quantity });
    }

    // SEGUNDA PASADA: ya sabemos que todo es válido, ahora sí modificamos
    const items = [];
    let totalPrice = 0;

    for (const { product, quantity } of products) {
      items.push({
        product: product._id,
        quantity,
        priceAtPurchase: product.price,
      });

      totalPrice += product.price * quantity;

      product.stock -= quantity;
      await product.save();
    }

    const newOrder = await orderModel.create({ user: userId, items, totalPrice, shippingAddress });

    user.cart = [];
    await user.save();

    res.status(201).send({ status: "Success", data: newOrder });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.payload._id;
    const orders = await orderModel.find({ user: userId }).populate("items.product");
    res.status(200).send({ status: "Success", data: orders });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id).populate("items.product");

    if (!order) {
      return res.status(404).send({ status: "Failed", message: "Pedido no encontrado" });
    }

    // Un usuario normal solo puede ver sus propios pedidos
    if (req.payload.role !== "admin" && order.user.toString() !== req.payload._id) {
      return res.status(403).send({ status: "Failed", message: "No tienes permiso para ver este pedido" });
    }

    res.status(200).send({ status: "Success", data: order });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Solo admin: ver todos los pedidos
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("items.product").populate("user", "name email");
    res.status(200).send({ status: "Success", data: orders });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

// Solo admin: actualizar estado del pedido
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).send({ status: "Failed", message: "Pedido no encontrado" });
    }
    res.status(200).send({ status: "Success", data: order });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };