import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

// ตั้งค่า CORS
app.use(cors());

// กำหนดตำแหน่งจัดเก็บไฟล์ที่อัปโหลด
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // โฟลเดอร์สำหรับเก็บไฟล์
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์
    }
});

const upload = multer({ storage: storage });

// API รับไฟล์ที่อัปโหลด
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully", file: req.file });
});

// เปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;