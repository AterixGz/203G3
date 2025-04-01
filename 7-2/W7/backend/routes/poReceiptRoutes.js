const express = require('express');
const router = express.Router();
const poReceiptController = require('../controllers/poReceiptController');

// POST: บันทึกข้อมูล PO Receipt
router.post('/', poReceiptController.createPOReceipt);

// GET: ดึงข้อมูล PO Receipt
router.get('/', poReceiptController.getPOReceipts);

// อาจเพิ่ม GET, PUT, DELETE ตามความต้องการ
// ...

module.exports = router;
