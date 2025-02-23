import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import moment from "moment"; // ติดตั้ง moment.js สำหรับจัดการวันที่

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';

const app = express();
const PORT = 3000;


dotenv.config();

// เปิดใช้ CORS สำหรับทุก origin
app.use(cors());
app.use(express.json());

const users = [
  { username: 'testuser', password: '$2b$12$q2EKI.3z4ViaaVO0e3MPuerhbqvKlKVRJ0myGlO62vq/KZAMEqRkG' } // hashed password for "password123"
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

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid username' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
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
