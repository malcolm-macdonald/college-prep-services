import express from 'express';
import {
  getSatPrepAvailability,
  // Add other availability controllers here if needed
} from '../services/calendarService.js';

const router = express.Router();

// Define the handler function separately
router.get('/sat-prep', async (req, res, next) => {
  const date = req.query.date as string;

  console.log(`[API] Received request for SAT prep availability on date: ${date}`);

  if (!date || typeof date !== 'string') {
    console.log('[API] Invalid date parameter');
    return res.status(400).json({ message: 'Date query parameter is required.' });
  }

  try {
    // Get available slots
    const slots = await getSatPrepAvailability(date);
    
    // Debug the response
    console.log(`[API] Found ${slots.length} slots for ${date}`);
    console.log('[API] Slots:', slots);
    console.log('[API] Type of slots:', typeof slots);
    console.log('[API] Is array?', Array.isArray(slots));
    
    // Always ensure we return an array
    if (!Array.isArray(slots)) {
      console.error('[API] Error: Slots is not an array:', slots);
      return res.json([]);
    }
    
    // Return the slots
    return res.json(slots);
  } catch (error) {
    console.error('[SatPrep Availability Error]:', error);
    // Return an empty array for better frontend handling
    return res.status(500).json([]);
  }
});

// Add other availability routes if needed

export default router; 