const express = require('express')
const router = express.Router()

const {
  addStock,
  getStockList,
  checkProductAvailability,
  validateAndRemoveCodes,
  checkCode,
} = require('../controllers/StockController')

router.post('/addstock', addStock)
router.get('/liststock', getStockList)
router.post('/check-availability', checkProductAvailability)
router.post('/validate-remove-codes', validateAndRemoveCodes)
router.post('/check-code', checkCode)

module.exports = {
  router,
}
