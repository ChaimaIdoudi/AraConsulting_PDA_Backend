const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  codes: [{
    type: Number,
    required: true,
  },]
})

module.exports = mongoose.models.Stocks || mongoose.model('Stocks', StockSchema)
