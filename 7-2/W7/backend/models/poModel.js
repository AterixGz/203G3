const db = require('../config/db');

// Model สำหรับสร้างใบสั่งซื้อ
const PO = {
    create: (po_number, order_date, requisition_id, supplier, total_amount, callback) => {
        db.query('INSERT INTO purchase_orders (po_number, order_date, requisition_id, supplier, total_amount) VALUES (?, ?, ?, ?, ?)', 
            [po_number, order_date, requisition_id, supplier, total_amount], callback);
    },
    createItem: (order_id, item_details, quantity, unit_price, total_amount, callback) => {
        db.query('INSERT INTO purchase_order_items (order_id, item_details, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?)', 
            [order_id, item_details, quantity, unit_price, total_amount], callback);
    }
};

module.exports = PO;
