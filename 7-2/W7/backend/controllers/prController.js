const PR = require('../models/prModel');

exports.createPR = (req, res) => {
    const { description, amount } = req.body;
    PR.create(description, amount, req.user.id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'PR created', id: result.insertId });
    });
};

exports.approvePR = (req, res) => {
    const { id } = req.params;
    PR.approve(id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'PR approved', id });
    });
};