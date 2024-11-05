const { StripeProvider } = require('./providers/stripeProvider');
const { PayPalProvider } = require('./providers/paypalProvider');
const Transaction = require('../models/transactionModel');  // Placeholder for database interactions

// Function to initiate a payment
exports.initiatePayment = async (amount, currency, provider) => {
  let paymentProvider;

  // Choose provider based on input
  if (provider === 'stripe') {
    paymentProvider = new StripeProvider();
  } else if (provider === 'paypal') {
    paymentProvider = new PayPalProvider();
  } else {
    throw new Error('Unsupported payment provider');
  }

  // Create a new payment through the chosen provider
  const transaction = await paymentProvider.createPayment(amount, currency);

  // Save the transaction to the database
  const newTransaction = new Transaction({ ...transaction, provider });
  await newTransaction.save();

  return newTransaction;
};

// Function to get the payment status
exports.getPaymentStatus = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new Error('Transaction not found');

  return transaction.status;
};

// Function to process a refund
exports.processRefund = async (transactionId, amount) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new Error('Transaction not found');

  const provider = transaction.provider === 'stripe' ? new StripeProvider() : new PayPalProvider();
  const refund = await provider.refund(transaction.providerId, amount);

  transaction.status = 'refunded';
  await transaction.save();

  return refund;
};

// Webhook processing
exports.processWebhook = async (event) => {
  // Example processing, depending on the payment provider’s webhook format
  if (event.type === 'payment_succeeded') {
    const transaction = await Transaction.findOne({ providerId: event.data.object.id });
    transaction.status = 'succeeded';
    await transaction.save();
  }
};
