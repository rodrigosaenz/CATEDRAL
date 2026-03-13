/**
 * @fileoverview CATEDRAL Server-Side Validation Middleware
 * Validates and sanitizes incoming form submission payloads.
 */

'use strict';

/** Valid project type values */
const VALID_TYPES = ['artista_individual', 'grupo', 'colectivo', 'creativo_tecnico'];

/** Valid role values */
const VALID_ROLES = ['performer_dj', 'productor', 'compositor', 'cantante', 'letrista', 'director_creativo', 'otro'];

/** Valid diagnostic level values */
const VALID_LEVELS = ['hobby', 'foundation', 'development', 'select'];

/**
 * Encodes HTML special characters and trims whitespace from a string value.
 * Uses entity encoding rather than tag stripping to prevent any HTML injection
 * regardless of nested or malformed tags.
 * @param {*} val - Input value
 * @returns {string} Sanitized string with HTML entities encoded
 */
function sanitizeString(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim()
    .substring(0, 1000); // cap length
}

/**
 * Express middleware that validates required fields and types in the submission.
 * Responds with 400 and error details if validation fails.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateSubmission(req, res, next) {
  const body = req.body || {};
  const errors = [];

  // Required text fields
  if (!body.a1_nombre || String(body.a1_nombre).trim().length === 0) {
    errors.push('a1_nombre (full name) is required');
  }

  if (!body.a3_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.a3_email))) {
    errors.push('a3_email must be a valid email address');
  }

  if (!body.a4_ciudad_pais || String(body.a4_ciudad_pais).trim().length === 0) {
    errors.push('a4_ciudad_pais (city and country) is required');
  }

  // Enum fields
  if (!body.a5_tipo_proyecto || !VALID_TYPES.includes(body.a5_tipo_proyecto)) {
    errors.push('a5_tipo_proyecto must be one of: ' + VALID_TYPES.join(', '));
  }

  // Array field
  if (!Array.isArray(body.a6_roles) || body.a6_roles.length === 0) {
    errors.push('a6_roles must be a non-empty array');
  } else {
    var invalidRoles = body.a6_roles.filter(function(role) { return !VALID_ROLES.includes(role); });
    if (invalidRoles.length > 0) {
      errors.push('a6_roles contains invalid values: ' + invalidRoles.join(', '));
    }
  }

  // Numeric score
  if (body.puntuacion_total !== undefined) {
    var score = Number(body.puntuacion_total);
    if (isNaN(score) || score < 0 || score > 24) {
      errors.push('puntuacion_total must be a number between 0 and 24');
    }
  }

  // Level
  if (body.nivel_diagnostico !== undefined && !VALID_LEVELS.includes(body.nivel_diagnostico)) {
    errors.push('nivel_diagnostico must be one of: ' + VALID_LEVELS.join(', '));
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

/**
 * Sanitizes all string fields in the payload to prevent injection attacks.
 * @param {Object} payload - Raw request body
 * @returns {Object} Sanitized payload
 */
function sanitizePayload(payload) {
  var clean = {};

  Object.keys(payload).forEach(function(key) {
    var val = payload[key];
    if (Array.isArray(val)) {
      clean[key] = val.map(function(item) {
        return typeof item === 'string' ? sanitizeString(item) : item;
      });
    } else if (typeof val === 'string') {
      clean[key] = sanitizeString(val);
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      clean[key] = val;
    } else if (val && typeof val === 'object') {
      clean[key] = sanitizePayload(val);
    }
    // Ignore null/undefined/functions/etc.
  });

  return clean;
}

module.exports = { validateSubmission, sanitizePayload };
