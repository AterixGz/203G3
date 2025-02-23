import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import moment from "moment"; // ติดตั้ง moment.js สำหรับจัดการวันที่

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
        const fileExtension = path.extname(file.originalname); // เอานามสกุลไฟล์
        const dateTime = moment().format("YYYYMMDD_HHmmss"); // ใช้ moment.js สร้างวันที่และเวลา
        const fileName = path.basename(file.originalname, fileExtension); // ชื่อไฟล์โดยไม่รวมส่วนขยาย
        const newFileName = `${fileName}_${dateTime}${fileExtension}`; // สร้างชื่อไฟล์ใหม่
        cb(null, newFileName);
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
