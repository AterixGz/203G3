// const PR = require('../models/prModel');

// exports.createPR = (req, res) => {
//     const { description, amount } = req.body;
//     PR.create(description, amount, req.user.id, (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json({ message: 'PR created', id: result.insertId });
//     });
// };

// // prRoutes.js
// const express = require('express');
// const prController = require('../controllers/prController');
// const authenticate = require('../middleware/authMiddleware');

// const router = express.Router();
// router.post('/', authenticate, prController.createPR);

// module.exports = router;

const express = require('express');
const prController = require('../controllers/prController');
const authenticate = require('../middleware/authMiddleware'); // ตรวจสอบว่าไฟล์นี้มีอยู่จริง

const router = express.Router();
router.post('/', authenticate, prController.createPR);
router.put('/:id/approve', authenticate, prController.approvePR);

module.exports = router; // ตรวจสอบให้แน่ใจว่ามีการส่ง router ออกไป
