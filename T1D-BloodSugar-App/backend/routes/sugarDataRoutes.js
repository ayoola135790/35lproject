const express = require('express');
const router = express.Router();
const sugarDataController = require('../controllers/sugarDataController');

router.get('/blood-sugar-data', sugarDataController.getBloodSugarData);
router.post('/analyze-blood-sugar', sugarDataController.analyzeBloodSugar);

module.exports = router;