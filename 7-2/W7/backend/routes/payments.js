const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// ดึงรายการชำระเงินทั้งหมด
router.get('/', (req, res) => {
    db.query('SELECT * FROM payments', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching payments', error: err });
        }
        res.json(results);
    });
});

// เพิ่มข้อมูลการชำระเงินใหม่
router.post('/', (req, res) => {
    const { payment_number, payment_date, payment_method, bank_account, total_amount, attachment, notes, invoices } = req.body;

    const sql = `INSERT INTO payments (payment_number, payment_date, payment_method, bank_account, total_amount, attachment, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [payment_number, payment_date, payment_method, bank_account, total_amount, attachment, notes], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error inserting payment', error: err });
        }

        const payment_id = result.insertId;

        // เพิ่มรายการใบแจ้งหนี้ที่เกี่ยวข้อง
        if (invoices && invoices.length > 0) {
            const invoiceValues = invoices.map(invoice => [payment_id, invoice.invoice_number, invoice.amount_paid]);
            db.query(`INSERT INTO payment_invoices (payment_id, invoice_number, amount_paid) VALUES ?`, [invoiceValues], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error inserting payment invoices', error: err });
                }
                res.json({ message: 'Payment added successfully', payment_id });
            });
        } else {
            res.json({ message: 'Payment added successfully', payment_id });
        }
    });
});

// ดึงข้อมูลการชำระเงินตาม ID
router.get('/:id', (req, res) => {
    const paymentId = req.params.id;
    db.query('SELECT * FROM payments WHERE payment_id = ?', [paymentId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching payment', error: err });
        }
        res.json(results[0]);
    });
});

// ลบการชำระเงิน
router.delete('/:id', (req, res) => {
    const paymentId = req.params.id;
    db.query('DELETE FROM payments WHERE payment_id = ?', [paymentId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting payment', error: err });
        }
        res.json({ message: 'Payment deleted successfully' });
    });
});

module.exports = router;
