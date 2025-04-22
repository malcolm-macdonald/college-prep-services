import express from 'express';
import cors from 'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Debug environment
console.log('Starting server with environment:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Available files in current directory:', fs.readdirSync(process.cwd()));

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Basic routes first
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint called');
  res.json({ status: 'ok', server: 'production-server' });
});

// Import routes conditionally with error handling
let availabilityRoutes, paymentsRouter;

try {
  console.log('Attempting to import availability routes');
  // Add dynamic import fallback
  try {
    const availabilityModule = await import('./routes/availability-test.js');
    availabilityRoutes = availabilityModule.default;
    console.log('Successfully imported availability-test.js');
  } catch (err) {
    console.error('Error importing availability-test.js:', err.message);
    // Provide mock routes as fallback
    const router = express.Router();
    router.get('/*', (req, res) => {
      res.json([
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
      ]);
    });
    availabilityRoutes = router;
    console.log('Using mock availability routes instead');
  }
  
  console.log('Attempting to import payments routes');
  try {
    const paymentsModule = await import('./routes/payments.js');
    paymentsRouter = paymentsModule.default;
    console.log('Successfully imported payments.js');
  } catch (err) {
    console.error('Error importing payments.js:', err.message);
    // Provide mock routes as fallback
    const router = express.Router();
    router.post('/create-payment-intent', (req, res) => {
      res.json({ clientSecret: 'mock_secret', amount: 5000 });
    });
    paymentsRouter = router;
    console.log('Using mock payment routes instead');
  }
} catch (err) {
  console.error('Error setting up routes:', err);
}

// API Routes with error handling
try {
  app.use('/api/availability', availabilityRoutes || ((req, res) => res.json([])));
  app.use('/api/payments', paymentsRouter || ((req, res) => res.json({ error: 'Payment service unavailable' })));
  console.log('Routes mounted successfully');
} catch (err) {
  console.error('Error mounting routes:', err);
}

// Determine the right static file path based on environment
let frontendPath;

// Try different possible locations for the frontend files
const possiblePaths = [
  path.join(__dirname, '../../dist'),
  path.join(__dirname, '../dist/public'),
  path.join(__dirname, 'dist/public'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), 'public')
];

// Find the first path that exists
for (const pathToCheck of possiblePaths) {
  try {
    if (fs.existsSync(pathToCheck)) {
      frontendPath = pathToCheck;
      console.log(`Found frontend files at: ${frontendPath}`);
      console.log('Files in frontend path:', fs.readdirSync(frontendPath));
      break;
    }
  } catch (err) {
    console.log(`Path check error for ${pathToCheck}:`, err.message);
  }
}

if (!frontendPath) {
  console.warn('Could not find frontend files! Using current directory as fallback.');
  frontendPath = process.cwd();
}

// Serve static frontend assets
try {
  app.use(express.static(frontendPath));
  console.log('Static middleware configured successfully');
} catch (err) {
  console.error('Error setting up static middleware:', err);
}

// Serve index.html for any routes not matched by the API or static files
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.warn(`index.html not found at ${indexPath}`);
      res.status(404).send('Frontend files not found');
    }
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Start server with error handling
try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend path: ${frontendPath}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
} 