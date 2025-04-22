import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Validation middleware for payment requests
const validatePaymentRequest = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isString().withMessage('Currency must be a string'),
  body('paymentMethodId').isString().withMessage('Payment method ID must be a string'),
];

/**
 * Create a payment intent
 * POST /api/payments/create-payment-intent
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    // Fixed price for all services: $9,999 (in cents)
    const amount = 999900;
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // Payment method will be attached on the client
    });

    // Send the client secret to the client
    res.json({ clientSecret: paymentIntent.client_secret, amount });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

/**
 * Process a payment
 * POST /api/payments/process-payment
 */
router.post('/process-payment', validatePaymentRequest, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { paymentMethodId, amount, currency } = req.body;

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment failed', details: error.message });
  }
});

/**
 * Webhook to handle Stripe events
 * POST /api/payments/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Handle successful payment (e.g., update database, send confirmation email)
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log(`Payment failed: ${failedPayment.last_payment_error?.message}`);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router; 