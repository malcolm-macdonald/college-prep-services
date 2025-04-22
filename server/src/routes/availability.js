import express from 'express';
import { getSatPrepAvailability } from '../services/calendarService.js';

const router = express.Router();

// Route for getting SAT Prep availability
router.get('/sat-prep', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    console.log(`[API] Received request for SAT prep availability on date: ${date}`);
    
    // Get availability from Google Calendar
    const timeSlots = await getSatPrepAvailability(date);
    
    console.log(`[API] Returning ${timeSlots.length} slots from Google Calendar`);
    
    return res.json(timeSlots);
  } catch (error) {
    console.error('[API] Error processing availability request:', error);
    return res.status(500).json({ error: 'Error fetching availability' });
  }
});

export default router; 