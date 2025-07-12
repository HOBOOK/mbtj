const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// GET /hello/
router.get('/health', indexController.healthCheck);

module.exports = router;
