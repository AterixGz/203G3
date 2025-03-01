import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import moment from "moment"; // ติดตั้ง moment.js สำหรับจัดการวันที่

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname , join } from 'path';

import { addUser, verifyUser, getUser, updateUserFiles } from './user.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// เปิดใช้ CORS สำหรับทุก origin
app.use(cors());
app.use(express.json());

const users = [
  { username: 'admin', password: '$2b$12$q2EKI.3z4ViaaVO0e3MPuerhbqvKlKVRJ0myGlO62vq/KZAMEqRkG' } // hashed password for "password123"
];

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        await addUser(username, password);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await verifyUser(username, password);
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}! This is a protected route.` });
});

// Logout route
app.post('/logout', (req, res) => {
  // In JWT-based authentication, logout is typically handled on the frontend by removing the token.
  res.json({ message: 'Logout successful.' });
});

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
app.post("/upload", authenticateToken, upload.array("file", 10), (req, res) => {
    if (!req.files) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const user = getUser(req.user.username);
    const newFiles = req.files.map(file => ({
        name: file.filename,
        originalName: file.originalname,
        uploadDate: moment().format(),
        size: file.size,
        type: file.mimetype
    }));

    user.files.push(...newFiles);
    updateUserFiles(req.user.username, user.files);

    res.json({
        message: "Files uploaded successfully",
        files: newFiles
    });
});

// แก้ไข files endpoint ให้แสดงเฉพาะไฟล์ของ user ที่ login
app.get("/files", authenticateToken, async (req, res) => {
  try {
    // ดึงข้อมูล user จาก token
    const username = req.user.username;
    const user = getUser(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ดึงข้อมูลไฟล์จาก user
    const userFiles = user.files;

    // สร้าง URL สำหรับแต่ละไฟล์
    const fileUrls = userFiles.map(file => ({
      name: file.name,
      originalName: file.originalName,
      uploadDate: file.uploadDate,
      size: file.size,
      type: file.type,
      url: `http://localhost:3000/uploads/${file.name}`
    }));

    res.json({ files: fileUrls });
  } catch (err) {
    res.status(500).json({ error: "Error fetching files", details: err.message });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// แก้ไข download endpoint ให้ตรวจสอบสิทธิ์
app.get("/download/:filename", authenticateToken, (req, res) => {
  const username = req.user.username;
  const user = getUser(username);
  const filename = req.params.filename;

  // ตรวจสอบว่าไฟล์เป็นของ user นี้หรือไม่
  const fileExists = user.files.some(file => file.name === filename);
  if (!fileExists) {
    return res.status(403).json({ error: "Access denied" });
  }

  const filePath = path.resolve(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ error: "Error downloading file", details: err.message });
    }
  });
});

// แก้ไข delete endpoint ให้ลบได้เฉพาะไฟล์ของตัวเอง
app.delete("/files/:filename", authenticateToken, async (req, res) => {
  const username = req.user.username;
  const user = getUser(username);
  const filename = req.params.filename;

  // ตรวจสอบว่าไฟล์เป็นของ user นี้หรือไม่
  const fileIndex = user.files.findIndex(file => file.name === filename);
  if (fileIndex === -1) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    // ลบข้อมูลไฟล์จาก user's files array
    user.files.splice(fileIndex, 1);
    updateUserFiles(username, user.files);

    // ลบไฟล์จริงจาก disk
    await fs.promises.unlink(join(__dirname, "uploads", filename));
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Cannot delete file", details: err.message });
  }
});

// เปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
