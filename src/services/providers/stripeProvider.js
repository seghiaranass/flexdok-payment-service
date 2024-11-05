const Stripe = require('stripe');
const config = require('../../config/default');
const stripe = Stripe(config.paymentProviders.stripe.apiKey);

class StripeProvider {
  
  // Method to create a payment
  async createPayment(amount, currency) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: currency,
        payment_method_types: ['card'], // Customize payment methods as needed
      });

      // Return essential details to be saved in our database
      return {
        providerId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } catch (error) {
      throw new Error(`Stripe Payment Creation Error: ${error.message}`);
    }
  }

  // Method to retrieve payment status
  async getPaymentStatus(providerId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(providerId);
      return paymentIntent.status;
    } catch (error) {
      throw new Error(`Stripe Payment Retrieval Error: ${error.message}`);
    }
  }

  // Method to process a refund
  async refund(providerId, amount = null) {
    try {
      // Create refund object with optional amount (in cents)
      const refund = await stripe.refunds.create({
        payment_intent: providerId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
      });

      return {
        refundId: refund.id,
        status: refund.status,
        amountRefunded: refund.amount / 100,
      };
    } catch (error) {
      throw new Error(`Stripe Refund Error: ${error.message}`);
    }
  }

  // Method to verify webhook events (important for secure webhook handling)
  verifyWebhook(signature, payload) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.paymentProviders.stripe.webhookSecret
      );
      return event;
    } catch (error) {
      throw new Error(`Stripe Webhook Verification Error: ${error.message}`);
    }
  }
}

module.exports = StripeProvider;
