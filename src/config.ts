// API Configuration
// Use Vite's way of accessing environment variables
// Make sure VITE_API_BASE_URL is defined in your .env file at the project root
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Default to test backend running on port 5000 