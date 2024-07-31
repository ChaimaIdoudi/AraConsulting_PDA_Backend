const express = require('express')
const router = express.Router()

const { addOf, getOfList } = require('../controllers/OfController')
router.post('/addof', addOf)
router.get('/list', getOfList)

module.exports = {
  router,
}
