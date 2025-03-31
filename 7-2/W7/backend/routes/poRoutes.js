const express = require('express');
const poController = require('../controllers/poController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', authenticate, poController.createPO);

module.exports = router;