import express from 'express';
import { getSatPrepAvailability, getGeneralAvailability } from '../services/calendarService.js';

const router = express.Router();

// GET /api/availability/sat-prep
router.get('/sat-prep', async (req, res) => {
  try {
    console.log('[API] Received request for SAT prep availability on date:', req.query.date);
    
    if (!req.query.date) {
      res.status(400).json({ error: 'Date parameter is required' });
      return;
    }
    
    const slots = await getSatPrepAvailability(req.query.date);
    console.log('[API] Returning', slots.length, 'slots from Google Calendar');
    res.json(slots);
  } catch (error) {
    console.error('[API] Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// GET /api/availability/sat-prep/all
router.get('/sat-prep/all', async (req, res) => {
  try {
    console.log('[API] Received request for ALL SAT prep availability');
    
    // Import the getAllSatPrepEvents function
    const { getAllSatPrepEvents } = await import('../services/calendarService.js');
    
    // Get all available events
    const events = await getAllSatPrepEvents();
    console.log('[API] Returning', events.length, 'total SAT Prep events');
    res.json(events);
  } catch (error) {
    console.error('[API] Error fetching all SAT prep events:', error);
    res.status(500).json({ error: 'Failed to fetch all SAT prep events' });
  }
});

// GET /api/availability/general
router.get('/general', async (req, res) => {
  try {
    console.log('[API] Received request for general availability on date:', req.query.date);
    
    if (!req.query.date) {
      res.status(400).json({ error: 'Date parameter is required' });
      return;
    }
    
    const serviceType = req.query.serviceType || 'general';
    const slots = await getGeneralAvailability(req.query.date, serviceType);
    console.log('[API] Returning', slots.length, 'general availability slots');
    res.json(slots);
  } catch (error) {
    console.error('[API] Error fetching general availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

export default router; 