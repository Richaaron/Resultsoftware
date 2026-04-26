// Netlify serverless function
process.env.NODE_ENV = 'production';

// Load environment variables from .env file in development
// In Netlify, use dashboard to set environment variables
if (process.env.NETLIFY === 'true' || !process.env.DATABASE_URL) {
  require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });
}

const serverless = require('serverless-http');
const app = require('../../backend/server');

exports.handler = serverless(app);



