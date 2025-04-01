const express = require('express');
const poController = require('../controllers/poController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// สร้างใบสั่งซื้อใหม่
router.post('/', authenticate, poController.createPO);

module.exports = router;
