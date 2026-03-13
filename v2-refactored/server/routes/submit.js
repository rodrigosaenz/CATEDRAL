/**
 * @fileoverview CATEDRAL Submit Route
 * Validates, sanitizes, and forwards form submissions to the n8n webhook.
 */

'use strict';

const express = require('express');
const router = express.Router();
const { validateSubmission, sanitizePayload } = require('../middleware/validation');

/**
 * POST /api/submit
 * Accepts a form submission payload, validates it, sanitizes it,
 * then proxies it to the configured webhook URL.
 */
router.post('/', validateSubmission, async function(req, res) {
  const clean = sanitizePayload(req.body);
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('WEBHOOK_URL is not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clean)
    });

    if (response.ok) {
      return res.json({ success: true });
    }

    console.error('Webhook responded with status:', response.status);
    return res.status(502).json({ error: 'Upstream webhook error' });
  } catch (err) {
    console.error('Webhook fetch error:', err);
    return res.status(502).json({ error: 'Could not reach webhook' });
  }
});

module.exports = router;
