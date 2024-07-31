const mongoose = require('mongoose')
const StockModel = require('../models/stockmodel')
const OfModel = require('../models/ofModel') // Import your OF model

// Add a new STOCK
exports.addStock = async (req, res) => {
  const { productName, codes } = req.body
  try {
    const newStcok = new StockModel({ productName, codes })
    await newStcok.save()
    res.status(201).json({ message: 'New Stock added', stock: newStcok })
  } catch (error) {
    res.status(500).json({ message: 'Error adding new Stock', error })
  }
}

// Get the list of STOCKS
exports.getStockList = async (req, res) => {
  try {
    const stockList = await StockModel.find()
    res.status(200).json({ message: 'List of Stocks retrieved', stockList })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving list of Stocks', error })
  }
}

exports.checkProductAvailability = async (req, res) => {
  const { productName, quantity } = req.body

  try {
    const stockItem = await StockModel.findOne({ productName })
    if (!stockItem) {
      return res
        .status(404)
        .json({ available: false, message: 'Product not found in stock.' })
    }

    if (stockItem.codes.length >= quantity) {
      return res
        .status(200)
        .json({ available: true, message: 'Product is available in stock.' })
    } else {
      return res
        .status(200)
        .json({ available: false, message: 'Insufficient quantity in stock.' })
    }
  } catch (error) {
    console.error('Error checking product availability:', error)
    res
      .status(500)
      .json({ available: false, message: 'Internal server error.' })
  }
}

exports.validateAndRemoveCodes = async (req, res) => {
  const { productName, codes, ofNumber } = req.body;

  console.log('Request Body:', req.body); // Log the request body

  try {
    const stockItem = await StockModel.findOne({ productName });
    if (!stockItem) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found in stock.' });
    }

    // Find valid and invalid codes
    const validCodes = codes.filter((code) => stockItem.codes.includes(code));
    const invalidCodes = codes.filter((code) => !stockItem.codes.includes(code));

    // Remove only the valid codes that were provided in the request
    stockItem.codes = stockItem.codes.filter(
      (code) => !validCodes.includes(code)
    );
    await stockItem.save(); // Save the updated stockItem with valid codes removed

    // Update the OF's addedQuantity
    const ofItem = await OfModel.findOne({ ofNumber });
    if (ofItem) {
      ofItem.products = ofItem.products.map((product) => {
        if (product.productName === productName) {
          product.addedQuantity += validCodes.length;
        }
        return product;
      });
      await ofItem.save(); // Save the updated OF with increased addedQuantity
    }

    res.status(200).json({
      success: true,
      message: 'Codes validated and processed from stock.',
      validCodes,
      invalidCodes,
    });
  } catch (error) {
    console.error('Error validating and processing codes:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


exports.checkCode = async (req, res) => {
  const { productName, code } = req.body

  try {
    const stockItem = await StockModel.findOne({ productName })
    if (!stockItem) {
      return res
        .status(404)
        .json({ valid: false, message: 'Product not found in stock.' })
    }

    if (stockItem.codes.includes(code)) {
      return res.status(200).json({ valid: true, message: 'Code is valid.' })
    } else {
      return res.status(200).json({ valid: false, message: 'Invalid code.' })
    }
  } catch (error) {
    console.error('Error checking code:', error)
    res.status(500).json({ valid: false, message: 'Internal server error.' })
  }
}
