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

// Custom request handler to ensure body parsing works
const handler = serverless(app, {
  binary: ['application/octet-stream', 'image/*']
});

exports.handler = async (event, context) => {
  // If this is an OPTIONS request, handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
      }
    };
  }
  
  // Call the serverless handler
  return handler(event, context);
};