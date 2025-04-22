import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key', {
  apiVersion: '2023-10-16', // Use the latest API version
});

const router = express.Router();

// Route to create a payment intent
router.post(
  '/create-payment-intent',
  [
    body('serviceType').notEmpty().withMessage('Service type is required'),
    body('appointmentId').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { serviceType, appointmentId } = req.body;

      // Fixed amount of $9,999.00 in cents
      const amount = 999900;
      
      // Create a PaymentIntent with the fixed amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        // Store metadata about the payment
        metadata: {
          serviceType,
          appointmentId: appointmentId || 'pending',
        },
        description: `Payment for ${serviceType} service`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Send the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret,
        amount,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }
);

// Webhook endpoint to handle Stripe events
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        // Here you would update your database to mark the payment as complete
        // and associate it with the appointment
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${failedPayment.id}`);
        // Here you would update your database or notify the user
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

// Route to get payment status
router.get('/status/:paymentIntentId', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
});

export default router; 