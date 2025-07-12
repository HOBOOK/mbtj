const express = require('express');
const router = express.Router();
const rugController = require('../controllers/rugController');

router.get('/', rugController.get);

module.exports = router;
