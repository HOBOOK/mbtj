const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.post('/topic', topicController.subscribe);
router.delete('/topic', topicController.unsubscribe);
router.get('/topic', topicController.getSubscribedTopics); 
router.get('/topic/published', topicController.getPublishedTopics); 

module.exports = router;
