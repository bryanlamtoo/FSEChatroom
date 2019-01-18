const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');

const chatController = require('../controllers/chat');

router.get('/', chatController.getIndex);

module.exports = router;

