const express = require('express');
const router = express.Router();
const vendingController = require('../controllers/VendingController');

router.post('/insert-coin', vendingController.insertCoin);
router.get('/balance', vendingController.getBalance);
router.post('/cancel', vendingController.cancelTransaction);
router.post('/reset', vendingController.resetMachine);

router.get('/products', vendingController.getAvailableProducts);
router.post('/select-product', vendingController.selectProduct);
router.post('/confirm-purchase', vendingController.confirmPurchase);

module.exports = router;