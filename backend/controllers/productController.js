const productModel = require("../models/productModel");

const getAllProducts = async (req, res) => {
  try {
    const { category, size, color } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (color) filter.color = color;

    const products = await productModel.find(filter).populate("category");

    res.status(200).send({ status: "Success", data: products });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const product = await productModel.findById(idProduct).populate("category");

    if (!product) {
      return res.status(404).send({ status: "Failed", message: "Producto no encontrado" });
    }
    res.status(200).send({ status: "Success", data: product });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, size, color, stock } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).send({
        status: "Failed",
        message: "Faltan campos requeridos: name, description, price, category",
      });
    }

    const newProduct = await productModel.create({ name, description, price, category, images, size, color, stock });
    res.status(201).send({ status: "Success", data: newProduct });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!product) {
      return res.status(404).send({ status: "Failed", message: "Producto no encontrado" });
    }
    res.status(200).send({ status: "Success", data: product });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send({ status: "Failed", message: "Producto no encontrado" });
    }
    res.status(200).send({ status: "Success", message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };