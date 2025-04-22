import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import availabilityRoutes from './routes/availability.js';
import paymentsRouter from './routes/payments';

// Load environment variables
dotenv.config();

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use port 5001 for consistency with frontend config
const PORT = 5001;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/availability', availabilityRoutes);
app.use('/api/payments', paymentsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'production-server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Production server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/availability/sat-prep?date=2025-04-25`);
}); 