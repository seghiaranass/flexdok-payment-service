const paymentService = require('../services/paymentService');


const StripeProvider = require('../services/providers/stripeProvider');
const stripeProvider = new StripeProvider();


// Controller to initiate a payment
exports.initiatePayment = async (req, res, next) => {
  try {
    const { amount, currency, provider } = req.body;
    const payment = await paymentService.initiatePayment(amount, currency, provider);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// Controller to get payment status
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const status = await paymentService.getPaymentStatus(transactionId);
    res.status(200).json({ success: true, status });
  } catch (error) {
    next(error);
  }
};

// Controller to process a refund
exports.processRefund = async (req, res, next) => {
  try {
    const { transactionId, amount } = req.body;
    const refund = await paymentService.processRefund(transactionId, amount);
    res.status(200).json({ success: true, refund });
  } catch (error) {
    next(error);
  }
};

// Controller to handle webhook

exports.handleWebhook = (req, res) => {
    const signature = req.headers['stripe-signature'];
    const payload = req.rawBody; // Ensure raw body middleware in app.js for Stripe webhook
  
    try {
      const event = stripeProvider.verifyWebhook(signature, payload);
  
      // Process event (e.g., mark payment as succeeded in the database)
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        // Update database for successful paymentIntent.id
        // ...
      }
  
      res.status(200).json({ received: true });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };