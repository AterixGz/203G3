// controllers/invoiceController.js
const invoiceModel = require('../models/invoiceModel');

// การสร้างใบแจ้งหนี้ใหม่
const createInvoice = (req, res) => {
  const invoiceData = req.body;  // รับข้อมูลจาก request body

  invoiceModel.createInvoice(invoiceData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error inserting invoice', error: err });
    }
    res.status(201).json({ message: 'Invoice created successfully', invoiceId: result.insertId });
  });
};

// การดึงข้อมูลใบแจ้งหนี้ทั้งหมด
const getInvoices = (req, res) => {
  invoiceModel.getInvoices((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching invoices', error: err });
    }
    res.status(200).json({ invoices: results });
  });
};

module.exports = { createInvoice, getInvoices };
