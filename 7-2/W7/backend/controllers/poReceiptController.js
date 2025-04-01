const connection = require('../config/db');  // เชื่อมต่อฐานข้อมูล

// POST: บันทึกการรับสินทรัพย์
const createPOReceipt = (req, res) => {
    const { receiptNumber, receiptDate, poRef, vendor, items } = req.body;

    const query = 'INSERT INTO po_receipts (receipt_number, receipt_date, po_ref, vendor) VALUES (?, ?, ?, ?)';
    connection.query(query, [receiptNumber, receiptDate, poRef, vendor], (err, result) => {
        if (err) {
            console.error('❌ Error inserting PO receipt:', err);
            return res.status(500).json({ message: 'Error inserting PO receipt', error: err.message });
        }

        // บันทึกข้อมูลสินค้า (หากมี)
        if (items && items.length > 0) {
            const itemQuery = 'INSERT INTO po_receipt_items (receipt_id, item_details, ordered_quantity, received_quantity, current_receive_quantity) VALUES ?';
            const itemValues = items.map(item => [result.insertId, item.itemDetails, item.orderedQuantity, item.receivedQuantity, item.currentReceiveQuantity]);

            connection.query(itemQuery, [itemValues], (err2, result2) => {
                if (err2) {
                    console.error('❌ Error inserting PO receipt items:', err2);
                    return res.status(500).json({ message: 'Error inserting PO receipt items', error: err2.message });
                }

                return res.status(201).json({ message: 'PO receipt created successfully' });
            });
        } else {
            return res.status(201).json({ message: 'PO receipt created successfully' });
        }
    });
};

// GET: ดึงข้อมูลการรับสินทรัพย์ทั้งหมด
const getPOReceipts = (req, res) => {
    const query = 'SELECT * FROM po_receipts';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching PO receipts:', err);
            return res.status(500).json({ message: 'Error fetching PO receipts' });
        }

        return res.status(200).json(results);
    });
};

module.exports = { createPOReceipt, getPOReceipts };
