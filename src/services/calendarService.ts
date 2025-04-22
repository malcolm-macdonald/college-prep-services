// Service to interact with our Calendar API

import axios from 'axios';
import { format } from 'date-fns';
import { API_BASE_URL } from '@/config';

/**
 * Fetch available time slots for a specific date
 */
export const getAvailableTimeSlots = async (date: Date, serviceType: string): Promise<string[]> => {
  try {
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log(`Fetching slots for ${formattedDate}, service: ${serviceType}`);

    // Determine the endpoint based on serviceType
    let endpoint: string;
    
    if (serviceType === 'sat-prep') {
      endpoint = `${API_BASE_URL}/api/availability/sat-prep`;
    } else {
      endpoint = `${API_BASE_URL}/api/availability/general`;
    }

    console.log(`Calling API endpoint: ${endpoint}?date=${formattedDate}`);
    
    // Make the API call with the service type parameter for general availability
    const params: Record<string, string> = { date: formattedDate };
    if (serviceType !== 'sat-prep') {
      params.serviceType = serviceType;
    }
    
    const response = await axios.get(endpoint, { params });

    // For debugging
    console.log('API Response:', response.data);
    
    // Ensure we always return an array
    if (!Array.isArray(response.data)) {
      console.warn('API did not return an array. Converting to empty array.');
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    // Return empty array on error
    return []; 
  }
};

/**
 * Fetch all upcoming SAT Prep events
 * @returns Promise<Array<SatPrepEvent>> - All available SAT Prep time slots
 */
export interface SatPrepEvent {
  id: string;
  date: string;
  timeSlot: string;
  fullTimeSlot: string;
}

export const getAllSatPrepEvents = async (): Promise<SatPrepEvent[]> => {
  try {
    console.log('Fetching all SAT Prep events');
    
    const endpoint = `${API_BASE_URL}/api/availability/sat-prep/all`;
    console.log(`Calling API endpoint: ${endpoint}`);
    
    const response = await axios.get(endpoint);
    
    console.log('API Response for all SAT Prep events:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('API did not return an array for SAT Prep events. Converting to empty array.');
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching all SAT Prep events:', error);
    return [];
  }
};

/**
 * Create a new appointment
 */
export interface AppointmentData {
  date: Date;
  timeSlot: string;
  studentName: string;
  parentName?: string;
  email: string;
  phone: string;
  serviceType: string;
  course?: string;
  notes?: string;
  applicationMaterials?: FileList;
}

/**
 * Creates a new appointment
 * @param appointmentData The appointment data
 * @returns Promise that resolves to the created appointment response
 */
export const createAppointment = async (appointmentData: AppointmentData): Promise<{ eventId: string }> => {
  try {
    // Log the appointment request
    console.log(`Creating appointment for ${appointmentData.studentName} on ${format(appointmentData.date, 'yyyy-MM-dd')} at ${appointmentData.timeSlot}`);

    // Create a FormData object for file uploads
    const formData = new FormData();
    
    // Add application materials if present
    if (appointmentData.applicationMaterials && appointmentData.applicationMaterials.length > 0) {
      for (let i = 0; i < appointmentData.applicationMaterials.length; i++) {
        formData.append('applicationMaterials', appointmentData.applicationMaterials[i]);
      }
    }
    
    // Add other appointment data as JSON
    formData.append('appointmentData', JSON.stringify({
      ...appointmentData,
      date: format(appointmentData.date, 'yyyy-MM-dd'),
      applicationMaterials: undefined // Remove the files from JSON
    }));

    // Make the API call
    const response = await axios.post(`${API_BASE_URL}/api/appointments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Failed to create appointment: ${response.statusText}`);
    }

    return { eventId: response.data.eventId || 'appointment-' + Date.now() };
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // For development, return a mock response if the API call fails
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Returning mock appointment ID due to error');
      return { eventId: 'mock-event-' + Date.now() };
    }
    
    throw error;
  }
}; 