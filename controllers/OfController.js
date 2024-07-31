const OfModel = require('../models/ofModel')

// Add a new OF
exports.addOf = async (req, res) => {
  const { ofNumber, articleName, products,actualQuantity } = req.body // Extract the data from the request body
  try {
  const { ofNumber, articleName, products,actualQuantity } = req.body // Extract the data from the request body
    const newOf = new OfModel({ ofNumber, articleName, products,actualQuantity }) // Create a new OF with the provided data
    await newOf.save()
    res.status(201).json({ message: 'New OF added', of: newOf })
  } catch (error) {
    res.status(500).json({ message: 'Error adding new OF', error })
  }
}

// Get the list of OFs
exports.getOfList = async (req, res) => {
  try {
    const ofList = await OfModel.find()
    res.status(200).json({ message: 'List of OFs retrieved', ofList })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving list of OFs', error })
  }
}
