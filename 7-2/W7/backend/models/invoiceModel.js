// models/invoiceModel.js
const connection = require('../config/db');  // เชื่อมต่อฐานข้อมูล

// ฟังก์ชันในการเพิ่มใบแจ้งหนี้ใหม่
const createInvoice = (invoiceData, callback) => {
  const { invoice_number, invoice_date, due_date, invoice_file, po_ref, vendor, total_amount } = invoiceData;

  const query = `INSERT INTO invoices (invoice_number, invoice_date, due_date, invoice_file, po_ref, vendor, total_amount) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [invoice_number, invoice_date, due_date, invoice_file, po_ref, vendor, total_amount], callback);
};

// ฟังก์ชันในการดึงข้อมูลใบแจ้งหนี้ทั้งหมด
const getInvoices = (callback) => {
  const query = 'SELECT * FROM invoices';
  connection.query(query, callback);
};

module.exports = { createInvoice, getInvoices };
