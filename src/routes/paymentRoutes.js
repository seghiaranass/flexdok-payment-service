const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Route to initialize a payment
router.post('/pay', paymentController.initiatePayment);

// Route to check the status of a payment
router.get('/status/:transactionId', paymentController.getPaymentStatus);

// Route to process refunds
router.post('/refund', paymentController.processRefund);

// Webhook route to handle provider callbacks
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
