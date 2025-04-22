import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import appointmentRoutes from './routes/appointments.js';
import availabilityRoutes from './routes/availabilityRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app; 