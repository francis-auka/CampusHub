const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:taskId', getChatHistory);

module.exports = router;
