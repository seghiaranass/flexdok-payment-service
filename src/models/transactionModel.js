const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  providerId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'pending' },
  provider: { type: String, required: true, default: 'stripe' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
