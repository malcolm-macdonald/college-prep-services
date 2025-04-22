import { google } from 'googleapis';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config();

// Get Calendar ID from environment variables
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
// Use the service account credentials
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

// Define the scope for Google Calendar API (read-only)
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// Keywords to look for in event titles
const SAT_PREP_KEYWORDS = ['sat prep', 'sat preparation', 'sat tutoring'];

// Placeholder function - replace with actual implementation
export async function getSatPrepAvailability(dateString: string): Promise<string[]> {
  if (!CALENDAR_ID) {
    throw new Error('Missing Google Calendar ID.');
  }
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
     throw new Error('Missing Google Service Account credentials.');
  }

  console.log(`Fetching SAT Prep availability for: ${dateString} from calendar: ${CALENDAR_ID}`);

  try {
    // --- Google API Authentication ---
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES
    });
    const calendar = google.calendar({ version: 'v3', auth });

    // --- Calculate Time Range for the Given Date ---
    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    // --- Fetch Events from Google Calendar ---
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true, // Expand recurring events
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} total events for ${dateString}`);

    // --- Filter for SAT Prep Available Slots Only ---
    const satPrepEvents = events.filter(event => {
      const title = event.summary?.toLowerCase() || '';
      return SAT_PREP_KEYWORDS.some(keyword => title.includes(keyword));
    });
    
    console.log(`Found ${satPrepEvents.length} SAT Prep events`);
    
    // Format each event's time slot (only start time, not range)
    const timeSlots = satPrepEvents.map(event => {
      const start = new Date(event.start?.dateTime || event.start?.date || '');
      
      // Format to "10:00 AM" style (only start time)
      return start.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    });

    console.log(`Returning time slots:`, timeSlots);
    return timeSlots;

  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw new Error('Failed to fetch availability from Google Calendar.');
  }
}

// Add other calendar service functions if needed
