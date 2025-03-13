const express = require('express');
const router = express.Router();
const sugarDataController = require('../controllers/sugarDataController');

router.get('/blood-sugar-data/:userId', sugarDataController.getUserBloodSugarData);

router.post('/blood-sugar-data', sugarDataController.addBloodSugarData);

router.post('/analyze-blood-sugar', sugarDataController.analyzeBloodSugar);

module.exports = router;