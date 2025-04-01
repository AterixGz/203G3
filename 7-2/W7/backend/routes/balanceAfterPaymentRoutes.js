// routes/balanceAfterPaymentRoutes.js
const express = require('express');
const router = express.Router();
const balanceAfterPaymentModel = require('../models/balanceAfterPaymentModel');

// API สำหรับดึงข้อมูลทั้งหมดของ balance_after_payment
router.get('/', (req, res) => {
  balanceAfterPaymentModel.getBalancesAfterPayment((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching balances after payment', error: err });
    }
    res.status(200).json(results);
  });
});

// API สำหรับเพิ่มข้อมูล balance_after_payment
router.post('/', (req, res) => {
  const balanceData = req.body;

  balanceAfterPaymentModel.addBalanceAfterPayment(balanceData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error inserting balance after payment', error: err });
    }
    res.status(201).json({ message: 'Balance after payment added successfully', data: result });
  });
});

module.exports = router;
