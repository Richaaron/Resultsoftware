// Netlify serverless function
process.env.NODE_ENV = 'production';
require('dotenv').config({ path: require('path').join(__dirname, '../../backend/.env') });

const serverless = require('serverless-http');
const app = require('../../backend/server');

exports.handler = serverless(app);



