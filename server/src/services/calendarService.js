import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const ADMIN_CALENDAR_ID = process.env.ADMIN_CALENDAR_ID || CALENDAR_ID; // Default to same calendar if not specified

// Keywords to look for in event titles
const SAT_PREP_KEYWORDS = ['sat prep', 'sat preparation', 'sat tutoring'];
const PRIVATE_TUTORING_KEYWORDS = ['private tutoring', 'tutoring session', 'one-on-one'];
const COLLEGE_APP_KEYWORDS = ['college app', 'application help', 'admissions'];

// Default time slots if no calendar events found (1-hour slots from 9 AM to 5 PM)
const DEFAULT_TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

// Create auth client from credentials
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES
});

const calendar = google.calendar({ version: 'v3', auth });

/**
 * Get SAT Prep availability for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Promise<string[]>} - Array of available time slots
 */
export async function getSatPrepAvailability(dateString) {
  try {
    console.log(`[Calendar Service] Fetching SAT Prep availability for date: ${dateString}`);
    
    // Parse the date string
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD');
    }

    // Calculate the start and end of the specified day
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
    
    const timeMax = new Date(date);
    timeMax.setHours(23, 59, 59, 999);

    // Fetch events for the specified day
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items;
    
    if (!events || events.length === 0) {
      console.log('[Calendar Service] No events found for this date');
      return [];
    }
    
    // Filter for SAT Prep events
    const satPrepEvents = events.filter(event => {
      const title = event.summary?.toLowerCase() || '';
      return SAT_PREP_KEYWORDS.some(keyword => title.includes(keyword));
    });
    
    console.log(`[Calendar Service] Found ${satPrepEvents.length} SAT Prep events`);
    
    // Format each event's time (only start time)
    const timeSlots = satPrepEvents.map(event => {
      const start = new Date(event.start.dateTime || event.start.date);
      
      // Format to "10:00 AM" style (only start time)
      const startStr = start.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      
      return startStr;
    });

    console.log(`[Calendar Service] Returning time slots:`, timeSlots);
    return timeSlots;
  } catch (error) {
    console.error('[Calendar Service] Error fetching SAT Prep availability:', error);
    return [];
  }
}

/**
 * Get general availability from admin calendar for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} serviceType - Type of service (private-tutoring, college-app-help, etc.)
 * @returns {Promise<string[]>} - Array of available time slots
 */
export async function getGeneralAvailability(dateString, serviceType = 'general') {
  try {
    console.log(`[Calendar Service] Fetching ${serviceType} availability for date: ${dateString}`);
    
    // Parse the date string
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD');
    }

    // Calculate the start and end of the specified day
    const timeMin = new Date(date);
    timeMin.setHours(0, 0, 0, 0);
    
    const timeMax = new Date(date);
    timeMax.setHours(23, 59, 59, 999);

    // Fetch busy periods from admin calendar for the specified day
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: ADMIN_CALENDAR_ID }]
      }
    });

    const busyPeriods = freeBusyResponse.data.calendars[ADMIN_CALENDAR_ID].busy || [];
    console.log(`[Calendar Service] Found ${busyPeriods.length} busy periods for admin calendar`);
    
    // If there are no busy periods, return all default time slots
    if (busyPeriods.length === 0) {
      console.log('[Calendar Service] No busy periods found, returning all default time slots');
      return DEFAULT_TIME_SLOTS;
    }
    
    // Create a map of busy periods to check against
    const busyMap = busyPeriods.map(period => ({
      start: new Date(period.start),
      end: new Date(period.end)
    }));
    
    // Generate available 1-hour time slots for the day (9 AM to 5 PM)
    const availableSlots = [];
    
    // Start at 9 AM
    const slotStart = new Date(date);
    slotStart.setHours(9, 0, 0, 0);
    
    // End at 5 PM
    const dayEnd = new Date(date);
    dayEnd.setHours(17, 0, 0, 0);
    
    // Generate 1-hour slots
    while (slotStart < dayEnd) {
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + 60);
      
      // Check if slot overlaps with any busy period
      const isAvailable = !busyMap.some(busy => 
        (slotStart >= busy.start && slotStart < busy.end) || // Start time within busy period
        (slotEnd > busy.start && slotEnd <= busy.end) || // End time within busy period
        (slotStart <= busy.start && slotEnd >= busy.end) // Slot contains busy period
      );
      
      if (isAvailable) {
        const startStr = slotStart.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        
        availableSlots.push(startStr);
      }
      
      // Move to next slot (1 hour)
      slotStart.setHours(slotStart.getHours() + 1);
    }
    
    console.log(`[Calendar Service] Returning ${availableSlots.length} available time slots`);
    return availableSlots;
  } catch (error) {
    console.error(`[Calendar Service] Error fetching ${serviceType} availability:`, error);
    // In case of error, return default time slots as fallback
    console.log('[Calendar Service] Returning default time slots due to error');
    return DEFAULT_TIME_SLOTS;
  }
}

/**
 * Get all upcoming SAT Prep events
 * @returns {Promise<Array>} - Array of SAT Prep events with date and time information
 */
export async function getAllSatPrepEvents() {
  try {
    console.log('[Calendar Service] Fetching ALL upcoming SAT Prep events');
    
    // Calculate time range (from now to 2 months in the future)
    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setMonth(timeMax.getMonth() + 2); // Look 2 months ahead
    
    // Fetch events within the time range
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true, // Expand recurring events
      orderBy: 'startTime',
      maxResults: 100 // Limit the number of results
    });

    const events = response.data.items || [];
    
    if (!events || events.length === 0) {
      console.log('[Calendar Service] No events found in the specified range');
      return [];
    }
    
    // Filter for SAT Prep events
    const satPrepEvents = events.filter(event => {
      const title = event.summary?.toLowerCase() || '';
      return SAT_PREP_KEYWORDS.some(keyword => title.includes(keyword));
    });
    
    console.log(`[Calendar Service] Found ${satPrepEvents.length} total SAT Prep events`);
    
    // Format each event with date and time information
    const formattedEvents = satPrepEvents.map(event => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      
      // Format date: "Monday, April 25, 2025"
      const dateStr = start.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Format times: "10:00 AM"
      const startStr = start.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      
      return {
        id: event.id,
        date: dateStr,
        dateObj: start, // For sorting
        timeSlot: startStr,
        fullTimeSlot: `${dateStr}: ${startStr}`
      };
    });
    
    // Sort by date
    formattedEvents.sort((a, b) => a.dateObj - b.dateObj);
    
    // Remove the dateObj property before returning
    return formattedEvents.map(({ dateObj, ...rest }) => rest);
  } catch (error) {
    console.error('[Calendar Service] Error fetching all SAT Prep events:', error);
    return [];
  }
} 