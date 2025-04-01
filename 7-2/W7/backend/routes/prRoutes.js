// routes/prRoutes.js
const express = require('express');
const prController = require('../controllers/prController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

//authenticate middleware สำหรับการตรวจสอบสิทธิ์ผู้ใช้

// สร้างใบขอซื้อ
router.post('/', authenticate, prController.createPR);

// ดึงข้อมูลใบขอซื้อ
router.get('/:id', authenticate, prController.getPR);

// เพิ่มรายการสินค้าในใบขอซื้อ
router.post('/items', authenticate, prController.createItem);

// ดึงรายการสินค้าตามใบขอซื้อ
router.get('/:requisition_id/items', authenticate, prController.getItems);

// เส้นทางสำหรับลบรายการสินค้า
router.delete('/items/:id', (req, res, next) => {
    console.log(`DELETE request received for item with id: ${req.params.id}`);  // ตรวจสอบว่า request ถูกส่งเข้ามาหรือไม่
    next();  // เรียกใช้ฟังก์ชันใน controller
}, prController.deleteItem);  // เชื่อมกับ controller สำหรับการลบรายการ

// ตรวจสอบให้แน่ใจว่าเส้นทางนี้กำหนดไว้
router.delete('/:id', prController.deletePR);  // ลบใบขอซื้อ (PR)

module.exports = router;
