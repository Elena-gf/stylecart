const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minLength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxLength: [80, "El nombre no debe superar los 80 caracteres"]
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"]
  },
  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  color: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productModel = mongoose.model("Product", productSchema, "Products");

module.exports = productModel;