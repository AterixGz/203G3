const PO = require('../models/poModel');
const db = require('../config/db');

exports.createPO = (req, res) => {
    const { pr_id } = req.body;
    db.query('SELECT * FROM purchase_requests WHERE id = ? AND status = ?', [pr_id, 'Approved'], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(400).send('PR not found or not approved');
        
        PO.create(pr_id, (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'PO created', id: result.insertId });
        });
    });
};