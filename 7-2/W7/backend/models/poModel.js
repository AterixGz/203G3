const db = require('../config/db');

const PO = {
    create: (pr_id, callback) => {
        db.query('INSERT INTO purchase_orders (pr_id, status) VALUES (?, ?)', 
            [pr_id, 'Created'], callback);
    }
};

module.exports = PO;