const express = require('express');
const { makePrediction, getHistory } = require('../controllers/predictionController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/predict', auth, makePrediction);
router.get('/history', auth, getHistory);

module.exports = router;
