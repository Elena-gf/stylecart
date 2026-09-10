const categoryModel = require("../models/categoryModel");

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).send({ status: "Success", data: categories });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).send({
        status: "Failed",
        message: "Faltan campos requeridos: name, slug",
      });
    }

    const newCategory = await categoryModel.create({ name, slug });
    res.status(201).send({ status: "Success", data: newCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ status: "Failed", error: "Esa categoría ya existe" });
    }
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!category) {
      return res.status(404).send({ status: "Failed", message: "Categoría no encontrada" });
    }
    res.status(200).send({ status: "Success", data: category });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).send({ status: "Failed", message: "Categoría no encontrada" });
    }
    res.status(200).send({ status: "Success", message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).send({ status: "Failed", error: error.message });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };