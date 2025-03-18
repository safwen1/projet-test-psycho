const express = require('express');
const router = express.Router();
const mwmsController = require('../controllers/mwmsController');

// Route pour soumettre un nouveau test
router.post('/submit', mwmsController.submitTest);

// Route pour obtenir un résultat spécifique
router.get('/result/:resultId', mwmsController.getResult);

// Route pour obtenir des statistiques
router.get('/statistics', mwmsController.getStatistics);

module.exports = router; 