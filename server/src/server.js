import express from 'express';
import cors from 'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import availabilityRoutes from './routes/availability-test.js';
import paymentsRouter from './routes/payments.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/availability', availabilityRoutes);
app.use('/api/payments', paymentsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'production-server' });
});

// Serve static frontend assets in production
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

// Serve index.html for any routes not matched by the API or static files
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 