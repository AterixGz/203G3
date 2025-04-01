// models/balanceAfterPaymentModel.js
const mysql = require('mysql2');
const db = require('../config/db');  // เชื่อมต่อกับไฟล์ config/db.js ของคุณ

// ฟังก์ชันสำหรับดึงข้อมูล balance_after_payment
const getBalancesAfterPayment = (callback) => {
  const query = 'SELECT * FROM balance_after_payment';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching balance after payment:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// ฟังก์ชันสำหรับเพิ่มข้อมูล balance_after_payment
const addBalanceAfterPayment = (data, callback) => {
  const { invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, payment_date, payment_method } = data;
  
  const query = `
    INSERT INTO balance_after_payment (invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, payment_date, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, payment_date, payment_method];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting balance after payment:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports = {
  getBalancesAfterPayment,
  addBalanceAfterPayment,
};
