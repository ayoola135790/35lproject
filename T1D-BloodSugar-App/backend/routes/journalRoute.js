const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

router.get('/entries/:userId', journalController.getJournalEntries);
router.post('/entries', journalController.addJournalEntry);

module.exports = router;