// const PR = require('../models/prModel');

// exports.createPR = (req, res) => {
//     const { description, amount } = req.body;
//     PR.create(description, amount, req.user.id, (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json({ message: 'PR created', id: result.insertId });
//     });
// };

// exports.approvePR = (req, res) => {
//     const { id } = req.params;
//     PR.approve(id, (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json({ message: 'PR approved', id });
//     });
// };




// controllers/prController.js
const PR = require('../models/prModel').PR;
const PRItem = require('../models/prModel').PRItem;

// ฟังก์ชันสร้างใบขอซื้อ
exports.createPR = (req, res) => {
  const { pr_number, request_date, department, requester, purpose, total_amount } = req.body;

  PR.create(pr_number, request_date, department, requester, purpose, total_amount, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'PR created', id: result.insertId });
  });
};

// ฟังก์ชันดึงข้อมูลใบขอซื้อ
exports.getPR = (req, res) => {
  const { id } = req.params;

  PR.getById(id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('PR not found');
    res.json(result[0]);
  });
};

// ฟังก์ชันเพิ่มรายการสินค้าในใบขอซื้อ
exports.createItem = (req, res) => {
  const { requisition_id, item_details, quantity, unit_price } = req.body;
  const total_amount = quantity * unit_price;

  PRItem.createItem(requisition_id, item_details, quantity, unit_price, total_amount, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Item added to PR', id: result.insertId });
  });
};

// ฟังก์ชันดึงรายการสินค้าตามใบขอซื้อ
exports.getItems = (req, res) => {
  const { requisition_id } = req.params;

  PRItem.getItemsByRequisitionId(requisition_id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

const db = require('../config/db');

exports.deleteItem = (req, res) => {
    const { id } = req.params;

    console.log(`Deleting item with id: ${id}`);

    // คำสั่ง SQL สำหรับลบรายการสินค้า
    const query = 'DELETE FROM purchase_requisition_items WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).send('Error deleting item');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }

        res.json({ message: 'Item deleted successfully' });
    });
};


exports.deletePR = (req, res) => {
    const { id } = req.params;
    
    console.log(`Received request to delete PR with ID: ${id}`);  // ตรวจสอบว่า ID ที่รับมาเป็นอะไร

    const query = 'DELETE FROM purchase_requisitions WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting PR:', err);
            return res.status(500).send('Error deleting PR');
        }

        // ตรวจสอบว่า result.affectedRows มากกว่าศูนย์หรือไม่
        if (result.affectedRows === 0) {
            console.log('PR not found');
            return res.status(404).send('PR not found');
        }

        console.log('PR deleted successfully');
        res.json({ message: 'PR deleted successfully' });
    });
};