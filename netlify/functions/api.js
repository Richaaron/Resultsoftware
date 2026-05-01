// Netlify serverless function
process.env.NODE_ENV = 'production';

// Ensure all necessary packages are available
const path = require('path');
const fs = require('fs');

// Add multiple search paths for modules
const searchPaths = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, '../../node_modules'),
  path.join(__dirname, '../../backend/node_modules'),
  '/opt/nodejs/node_modules'
];

// Set NODE_PATH
process.env.NODE_PATH = searchPaths.filter(p => {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}).join(path.delimiter);

require('module').Module._initPaths();

// Preload critical packages to ensure they're available
try {
  require('pg');
  require('sequelize');
  require('bcryptjs');
} catch (e) {
  console.error('Failed to preload packages:', e.message);
}

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Node paths:', process.env.NODE_PATH);
console.log('Environment DATABASE_URL set:', !!process.env.DATABASE_URL);
console.log('Environment JWT_SECRET set:', !!process.env.JWT_SECRET);

const serverless = require('serverless-http');
const app = require('../../backend/server');

const handler = serverless(app, {
  basePath: '/.netlify/functions',
  binary: ['application/octet-stream', 'image/*']
});

exports.handler = async (event, context) => {
  // Get the actual request path
  let requestPath = event.rawPath || event.path || event.requestContext?.path || '';
  
  // Remove query string and hash
  if (requestPath.includes('?')) {
    requestPath = requestPath.split('?')[0];
  }
  
  const method = event.httpMethod || 'GET';
  
  console.log(`[netlify-function] ${method} ${requestPath}`);
  
  // CRITICAL: Only invoke Express for /api requests
  const isApiPath = requestPath.includes('/api');
  
  if (!isApiPath) {
    console.log(`[netlify-function] NOT an API path, returning 404 to allow static file serving`);
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Not Found'
    };
  }

  // Handle CORS preflight for API requests
  if (method === 'OPTIONS') {
    console.log(`[netlify-function] OPTIONS request, handling CORS`);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
  }
  
  // Fix Netlify base64 encoded bodies for serverless-http
  if (event.body && event.isBase64Encoded) {
    try {
      event.body = Buffer.from(event.body, 'base64').toString('utf8');
      event.isBase64Encoded = false;
      console.log(`[netlify-function] Decoded base64 body`);
    } catch (e) {
      console.error(`[netlify-function] Failed to decode base64 body`, e);
    }
  }

  // Process API request through Express
  console.log(`[netlify-function] Processing API request: ${method} ${requestPath}`);
  try {
    const result = await handler(event, context);
    console.log(`[netlify-function] API response status: ${result.statusCode}`);
    return result;
  } catch (error) {
    console.error(`[netlify-function] Error processing request:`, error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message })
    };
  }
};