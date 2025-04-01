const db = require('../config/db');

// สร้าง PO Receipt
exports.createPOReceipt = (receiptData, callback) => {
  const { receipt_number, receipt_date, po_reference, vendor, total_amount } = receiptData;

  // Query SQL สำหรับการบันทึกข้อมูลในตาราง `po_receipts`
  const query = `
    INSERT INTO po_receipts (receipt_number, receipt_date, po_reference, vendor, total_amount)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [receipt_number, receipt_date, po_reference, vendor, total_amount], (err, result) => {
    if (err) {
      console.error('❌ Error while inserting PO Receipt:', err);
      callback(err, null);
      return;
    }

    console.log('✅ PO Receipt inserted successfully!');
    callback(null, result);
  });
};

// สร้าง PO Receipt Items
exports.createPOReceiptItems = (receiptId, items, callback) => {
  // เตรียม query สำหรับการบันทึกรายการสินทรัพย์
  const query = `
    INSERT INTO po_receipt_items (receipt_id, item_details, ordered_quantity, received_quantity, current_receive_quantity)
    VALUES ?
  `;

  const values = items.map(item => [
    receiptId,
    item.item_details,
    item.ordered_quantity,
    item.received_quantity,
    item.current_receive_quantity
  ]);

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('❌ Error while inserting PO Receipt Items:', err);
      callback(err, null);
      return;
    }

    console.log('✅ PO Receipt Items inserted successfully!');
    callback(null, result);
  });
};
