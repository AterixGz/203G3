// const db = require('../config/db');

// const PR = {
//     create: (description, amount, user_id, callback) => {
//         db.query('INSERT INTO purchase_requests (description, amount, status, user_id) VALUES (?, ?, ?, ?)', 
//             [description, amount, 'Pending', user_id], callback);
//     },
//     approve: (id, callback) => {
//         db.query('UPDATE purchase_requests SET status = ? WHERE id = ?', ['Approved', id], callback);
//     }
// };

// module.exports = PR;




const db = require('../config/db'); // เชื่อมต่อกับฐานข้อมูล

// Model สำหรับการจัดการใบขอซื้อ
const PR = {
  // ฟังก์ชันสร้างใบขอซื้อ
  create: (pr_number, request_date, department, requester, purpose, total_amount, callback) => {
    db.query(
      'INSERT INTO purchase_requisitions (pr_number, request_date, department, requester, purpose, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [pr_number, request_date, department, requester, purpose, total_amount],
      callback
    );
  },
  // ฟังก์ชันดึงข้อมูลใบขอซื้อ
  getById: (id, callback) => {
    db.query('SELECT * FROM purchase_requisitions WHERE id = ?', [id], callback);
  },
  // ฟังก์ชันอัปเดตใบขอซื้อ
  update: (id, pr_number, request_date, department, requester, purpose, total_amount, callback) => {
    db.query(
      'UPDATE purchase_requisitions SET pr_number = ?, request_date = ?, department = ?, requester = ?, purpose = ?, total_amount = ? WHERE id = ?',
      [pr_number, request_date, department, requester, purpose, total_amount, id],
      callback
    );
  },
  // ฟังก์ชันลบใบขอซื้อ
  delete: (id, callback) => {
    db.query('DELETE FROM purchase_requisitions WHERE id = ?', [id], callback);
  }
};

// Model สำหรับการจัดการรายการสินค้าในใบขอซื้อ
const PRItem = {
  // ฟังก์ชันเพิ่มรายการสินค้าในใบขอซื้อ
  createItem: (requisition_id, item_details, quantity, unit_price, total_amount, callback) => {
    db.query(
      'INSERT INTO purchase_requisition_items (requisition_id, item_details, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?)',
      [requisition_id, item_details, quantity, unit_price, total_amount],
      callback
    );
  },
  // ฟังก์ชันดึงรายการสินค้าตามรหัสใบขอซื้อ
  getItemsByRequisitionId: (requisition_id, callback) => {
    db.query('SELECT * FROM purchase_requisition_items WHERE requisition_id = ?', [requisition_id], callback);
  },
  // ฟังก์ชันลบรายการสินค้า
  deleteItem: (id, callback) => {
    db.query('DELETE FROM purchase_requisition_items WHERE id = ?', [id], callback);
  }
};

module.exports = { PR, PRItem };

