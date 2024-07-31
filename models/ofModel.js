const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  addedQuantity: {
    type: Number,
    default: 0,
  },
})

const RecetteSchema = new mongoose.Schema({
  ofNumber: {
    type: Number,
    required: true,
  },
  articleName: {
    type: String,
    required: true,
  },
  products: [ProductSchema],
})

module.exports = mongoose.models.Ofs || mongoose.model('Ofs', RecetteSchema)
