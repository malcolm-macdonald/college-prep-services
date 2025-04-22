import express from 'express';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import availabilityRoutes from './routes/availability-test.js';
import paymentsRouter from './routes/payments.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5001;

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
  res.json({ status: 'ok', server: 'test-server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/availability/sat-prep?date=2025-04-25`);
}); 