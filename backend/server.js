const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for frontend connection

// กำหนด Storage สำหรับ Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage'); // โฟลเดอร์ที่ใช้เก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์
    }
});

const upload = multer({ storage: storage });

// Middleware สำหรับเสิร์ฟไฟล์อัปโหลด (ทำให้เข้าถึงไฟล์ได้จาก URL)
app.use('/storage', express.static('storage'));

// Route สำหรับอัปโหลดไฟล์
app.post('/upload', upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์' });
    }
    res.json({ message: 'อัปโหลดไฟล์สำเร็จ', files: req.files });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
