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
  const { username, password } = req.body;

  // ตรวจสอบว่ามี username ซ้ำหรือไม่
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // เพิ่ม user ใหม่
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully!' });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid username' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password.' });
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


//แสดงไฟล์
app.get("/files", async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const uploadFolder = join(__dirname, "uploads"); // ✅ ใช้ join อย่างถูกต้อง

    if (!fs.existsSync(uploadFolder)) {
      return res.status(404).json({ error: "Upload folder not found" });
    }

    const files = await fs.promises.readdir(uploadFolder);
    const fileUrls = files.map(file => ({
      name: file,
      url: `http://localhost:3000/uploads/${file}`
    }));

    res.json({ files: fileUrls });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถอ่านโฟลเดอร์ได้", details: err.message });
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API สำหรับดาวน์โหลดไฟล์
app.get("/download/:filename", (req, res) => {
  const filePath = path.resolve(__dirname, "uploads", req.params.filename);

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


//ลบไฟล์
app.delete("/files/:filename", async (req, res) => {
  const filename = req.params.filename;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const uploadFolder = join(__dirname, "uploads");

  try {
    await fs.promises.unlink(join(uploadFolder, filename));
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถลบไฟล์ได้", details: err.message });
  }
  
})
// เปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
