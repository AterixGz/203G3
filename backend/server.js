import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
const PORT = 3000;

// เปิดใช้ CORS สำหรับทุก origin
app.use(cors());

// ตั้งค่าการจัดเก็บไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // ระบุโฟลเดอร์ที่ต้องการเก็บไฟล์
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // ใช้เวลาเป็นชื่อไฟล์เพื่อไม่ให้ซ้ำ
    },
});

const upload = multer({ storage: storage });

// API สำหรับรับหลายไฟล์และอัปโหลด
app.post("/upload", upload.array("file", 10), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  res.json({
    message: "Files uploaded successfully",
    files: req.files,
  });
});

// เปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;