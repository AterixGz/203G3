const PO = require('../models/poModel');
const db = require('../config/db');

exports.createPO = (req, res) => {
    const { po_number, order_date, requisition_id, supplier, total_amount, items } = req.body;

    // ขั้นตอนการสร้างใบสั่งซื้อ
    PO.create(po_number, order_date, requisition_id, supplier, total_amount, (err, result) => {
        if (err) return res.status(500).send(err);

        const order_id = result.insertId;

        // เพิ่มรายการสินค้าในใบสั่งซื้อ
        items.forEach(item => {
            PO.createItem(order_id, item.item_details, item.quantity, item.unit_price, item.total_amount, (err) => {
                if (err) return res.status(500).send(err);
            });
        });

        res.json({ message: 'PO created', id: order_id });
    });
};
