// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// สร้างใบแจ้งหนี้ใหม่
router.post('/create', invoiceController.createInvoice);

// ดึงข้อมูลใบแจ้งหนี้ทั้งหมด
router.get('/', invoiceController.getInvoices);

module.exports = router;
