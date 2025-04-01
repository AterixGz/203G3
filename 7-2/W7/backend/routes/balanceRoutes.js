const express = require('express');
const router = express.Router();
const balanceModel = require('../models/balanceModel');

// ดึงข้อมูลทั้งหมดของ balances
router.get('/', (req, res) => {
    balanceModel.getAllBalances((err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching balances', error: err });
        }
        res.status(200).json(results);
    });
});

// เพิ่มข้อมูล balance ใหม่
router.post('/', (req, res) => {
    const newBalance = req.body;

    balanceModel.addBalance(newBalance, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error inserting balance', error: err });
        }
        res.status(201).json({ message: 'Balance added successfully', data: results });
    });
});

// อัพเดตข้อมูล balance
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    balanceModel.updateBalance(id, updatedData, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating balance', error: err });
        }
        res.status(200).json({ message: 'Balance updated successfully', data: results });
    });
});

module.exports = router;
