import axios from 'axios';
import { API_BASE_URL } from '@/config';

// Interface for payment intent response
interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

// Interface for payment status response
interface PaymentStatusResponse {
  status: string;
  amount: number;
  metadata: {
    serviceType: string;
    appointmentId: string;
  };
}

/**
 * Create a payment intent for a specific service and appointment
 * @param serviceType The type of service being booked
 * @param appointmentId The appointment ID (optional, can be 'pending')
 * @returns Promise with the payment intent client secret and amount
 */
export const createPaymentIntent = async (
  serviceType: string,
  appointmentId?: string
): Promise<PaymentIntentResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/payments/create-payment-intent`, {
      serviceType,
      appointmentId: appointmentId || 'pending'
    });

    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

/**
 * Get the status of a payment intent
 * @param paymentIntentId The ID of the payment intent
 * @returns Promise with the payment status, amount, and metadata
 */
export const getPaymentStatus = async (paymentIntentId: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payments/status/${paymentIntentId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw new Error('Failed to retrieve payment status');
  }
}; 