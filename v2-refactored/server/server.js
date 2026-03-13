/**
 * @fileoverview CATEDRAL Express Backend Server
 * Provides a secure proxy endpoint for form submissions with
 * rate limiting, input sanitization, and server-side validation.
 *
 * Usage:
 *   npm install
 *   cp server/.env.example server/.env   # and fill in values
 *   node server/server.js
 */

'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

const submitRouter = require('./routes/submit');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SECURITY MIDDLEWARE =====

// Set security-related HTTP headers
app.use(helmet());

// Enable CORS for configured origin only
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: ALLOWED_ORIGIN, methods: ['POST', 'GET'] }));

// Rate limiting: max 10 submissions per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
    error_es: 'Demasiadas solicitudes. Intente más tarde.'
  }
});
app.use('/api/', limiter);

// Parse JSON bodies (limit to 50kb to prevent abuse)
app.use(express.json({ limit: '50kb' }));

// ===== STATIC FILES =====

// Serve the v2-refactored frontend (one level up from server/)
app.use(express.static(path.join(__dirname, '..')));

// ===== ROUTES =====

app.use('/api/submit', submitRouter);

// Health check endpoint
app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(function(req, res) {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== START =====

app.listen(PORT, function() {
  console.log('CATEDRAL server running on port ' + PORT);
});

module.exports = app;
