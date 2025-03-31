const db = require('../config/db');

const PR = {
    create: (description, amount, user_id, callback) => {
        db.query('INSERT INTO purchase_requests (description, amount, status, user_id) VALUES (?, ?, ?, ?)', 
            [description, amount, 'Pending', user_id], callback);
    },
    approve: (id, callback) => {
        db.query('UPDATE purchase_requests SET status = ? WHERE id = ?', ['Approved', id], callback);
    }
};

module.exports = PR;