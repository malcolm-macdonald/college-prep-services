import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createPaymentIntent } from '@/services/paymentService';

// Initialize Stripe with the publishable key
// This should come from environment variables in a production app
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

interface PaymentFormProps {
  onBack: () => void;
  onComplete: () => void;
  serviceType: string;
  appointmentId?: string;
}

const StripeCheckoutForm: React.FC<{
  onComplete: () => void;
  serviceType: string;
  appointmentId?: string;
  onBack: () => void;
}> = ({ onComplete, serviceType, appointmentId, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const { toast } = useToast();

  // Create a payment intent when the component mounts
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setProcessing(true);
        const response = await createPaymentIntent(serviceType, appointmentId);
        
        setClientSecret(response.clientSecret);
        setAmount(response.amount);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setError("Could not initialize payment. Please try again.");
      } finally {
        setProcessing(false);
      }
    };

    fetchPaymentIntent();
  }, [serviceType, appointmentId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setProcessing(false);
      setError("An error occurred with the payment form");
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You could collect these details in a separate form if needed
          },
        }
      });

      if (result.error) {
        setError(result.error.message || "An error occurred while processing your payment");
      } else if (result.paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully",
          variant: "default"
        });
        onComplete();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (processing && !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Initializing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="bg-primary/10 p-6 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Service:</span>
            <span>{serviceType === 'private-tutoring' 
              ? 'Private Tutoring' 
              : serviceType === 'sat-prep'
                ? 'SAT Preparation'
                : 'College Application Help'}</span>
          </div>
          
          <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t border-primary/20">
            <span>Total:</span>
            <span className="text-lg">${(amount / 100).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium mb-1">
            Card Information
          </label>
          <div className="p-3 border rounded-md bg-background">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {error && (
            <div className="text-sm text-destructive mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button"
          variant="outline" 
          onClick={onBack}
          disabled={processing}
        >
          Back
        </Button>
        <Button 
          type="submit"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Payment Information</CardTitle>
        <CardDescription>Please enter your payment details to complete your booking</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <StripeCheckoutForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  );
}; 