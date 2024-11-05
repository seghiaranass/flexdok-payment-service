const Joi = require('joi');

// Define validation schema for payment initiation
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  provider: Joi.string().valid('stripe', 'paypal').required(),
});

// Validation middleware function
const validatePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = { validatePayment };
