import path from "path";
import fs from "fs";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "url"; // ใช้สำหรับหา __dirname ใน ES Module
import mysql from "mysql2";

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: "yamanote.proxy.rlwy.net",
  user: "root",
  password: "qmPOypIUaSWGTMuZgOnkzXprDKmnAKJd",
  database: "railway",
  port: "47001",
});

const app = express();
const PORT = 3000;

// สร้าง __dirname สำหรับ ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ตัวอย่าง API
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Endpoint สำหรับบันทึกข้อมูล PR
app.post("/api/pr", (req, res) => {
  const newPR = req.body;

  // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
  if (!newPR || Object.keys(newPR).length === 0) {
    return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" });
  }

  // ตัวอย่าง: บันทึกข้อมูลลงในไฟล์ JSON
  const PR_FILE = path.join(__dirname, "data", "Pr.json");
  let prData = [];

  // อ่านข้อมูลเดิมจาก Pr.json
  if (fs.existsSync(PR_FILE)) {
    const fileData = fs.readFileSync(PR_FILE, "utf-8");
    prData = JSON.parse(fileData);
  }

  // เพิ่มข้อมูลใหม่
  prData.push(newPR);

  // เขียนข้อมูลกลับไปที่ Pr.json
  fs.writeFileSync(PR_FILE, JSON.stringify(prData, null, 2));

  res.status(201).json({ message: "บันทึกข้อมูล PR สำเร็จ" });
});

// Endpoint สำหรับดึงข้อมูล PR จาก Pr.json
app.get("/api/pr", (req, res) => {
  const PR_FILE = path.join(__dirname, "data", "Pr.json");

  // ตรวจสอบว่าไฟล์ Pr.json มีอยู่หรือไม่
  if (!fs.existsSync(PR_FILE)) {
    return res.status(404).json({ message: "ไม่พบไฟล์ Pr.json" });
  }

  // อ่านข้อมูลจากไฟล์ Pr.json
  const data = fs.readFileSync(PR_FILE, "utf-8");
  const prList = JSON.parse(data);

  res.json(prList);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});