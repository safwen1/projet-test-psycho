const express = require('express');
const router = express.Router();
const bigFiveController = require('../controllers/bigFiveController');

// Routes protégées
router.post('/submit', bigFiveController.submitTest);
router.get('/statistics', bigFiveController.getStatistics);

module.exports = router; 