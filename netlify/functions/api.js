// Netlify serverless function - wraps Express app
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const serverless = require('serverless-http');
const app = require(path.join(__dirname, '../../backend/server'));

exports.handler = serverless(app);

