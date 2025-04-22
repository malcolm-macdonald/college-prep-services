import express from 'express';
import cors from 'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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

// Determine the right static file path based on environment
let frontendPath;

// Try different possible locations for the frontend files
const possiblePaths = [
  path.join(__dirname, '../../dist'),
  path.join(__dirname, '../dist/public'),
  path.join(__dirname, 'dist/public'),
  path.join(process.cwd(), 'dist')
];

// Find the first path that exists
for (const path of possiblePaths) {
  if (fs.existsSync(path)) {
    frontendPath = path;
    console.log(`Found frontend files at: ${frontendPath}`);
    break;
  }
}

if (!frontendPath) {
  console.warn('Could not find frontend files! Using current directory as fallback.');
  frontendPath = process.cwd();
}

// Serve static frontend assets
app.use(express.static(frontendPath));

// Serve index.html for any routes not matched by the API or static files
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend files not found');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend path: ${frontendPath}`);
}); 