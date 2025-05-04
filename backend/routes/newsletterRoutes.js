const express = require('express');
const { subscribeToNewsletter } = require('../controllers/newsletterController');

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeToNewsletter);

module.exports = router;