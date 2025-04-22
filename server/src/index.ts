import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import availabilityRoutes from './routes/availabilityRoutes.js';

// Load environment variables
dotenv.config();

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths for production and development
const DIST_PATH = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'public') 
  : path.join(__dirname, '../../dist');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log environment and paths
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Current directory:', __dirname);
console.log('Static files path:', DIST_PATH);

// API Routes
app.use('/api/availability', availabilityRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve static files from the React app
app.use(express.static(DIST_PATH));

// Handle SPA routing - this should be after all API routes
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_PATH, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
}); 