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

  // อ่านข้อมูลเดิมจาก Pr.json
  const PR_FILE = path.join(__dirname, "data", "Pr.json");
  let prData = [];
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


//                                            Login

// Path ของไฟล์ userRole.json
const USER_ROLE_FILE = path.join(__dirname, "data", "userRole.json");

// Endpoint สำหรับตรวจสอบการเข้าสู่ระบบ
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // อ่านข้อมูลผู้ใช้จาก userRole.json
  const userData = JSON.parse(fs.readFileSync(USER_ROLE_FILE, "utf-8"));
  const user = userData.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // หากพบผู้ใช้ ส่งข้อมูลผู้ใช้กลับไป
    res.json({ success: true, user });
  } else {
    // หากไม่พบผู้ใช้ ส่งข้อความแสดงข้อผิดพลาด
    res.status(401).json({ success: false, message: "Invalid username or password" });
  }
});

// Endpoint สำหรับอัปเดตสถานะ PR
app.put("/api/pr/:prNumber", (req, res) => {
  const { prNumber } = req.params;
  const { status } = req.body;

  // ตรวจสอบว่าไฟล์ Pr.json มีอยู่หรือไม่
  const PR_FILE = path.join(__dirname, "data", "Pr.json");
  if (!fs.existsSync(PR_FILE)) {
    return res.status(404).json({ message: "ไม่พบไฟล์ Pr.json" });
  }

  // อ่านข้อมูลจากไฟล์ Pr.json
  const data = fs.readFileSync(PR_FILE, "utf-8");
  let prList = JSON.parse(data);

  // ค้นหา PR ที่ต้องการอัปเดต
  const prIndex = prList.findIndex((pr) => pr.prNumber === prNumber);
  if (prIndex === -1) {
    return res.status(404).json({ message: "ไม่พบ PR ที่ระบุ" });
  }

  // อัปเดตสถานะ
  prList[prIndex].status = status;

  // เขียนข้อมูลกลับไปที่ Pr.json
  fs.writeFileSync(PR_FILE, JSON.stringify(prList, null, 2));

  res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", pr: prList[prIndex] });
});

// Endpoint สำหรับดึงข้อมูล PR ที่มีสถานะ "approved"
app.get("/api/pr/approved", (req, res) => {
  const PR_FILE = path.join(__dirname, "data", "Pr.json");

  // ตรวจสอบว่าไฟล์ Pr.json มีอยู่หรือไม่
  if (!fs.existsSync(PR_FILE)) {
    return res.status(404).json({ message: "ไม่พบไฟล์ Pr.json" });
  }

  // อ่านข้อมูลจากไฟล์ Pr.json
  const data = fs.readFileSync(PR_FILE, "utf-8");
  const prList = JSON.parse(data);

  // กรองเฉพาะ PR ที่มีสถานะ "approved"
  const approvedPRs = prList.filter((pr) => pr.status === "approved");

  res.json(approvedPRs);
});



// Path ของไฟล์ RFA.json          แสดงข้อมูลสินทรัพย์
const RFA_FILE = path.join(__dirname, "data", "RFA.json");
// Endpoint สำหรับดึงข้อมูลสินทรัพย์
app.get("/api/assets", (req, res) => {
  if (!fs.existsSync(RFA_FILE)) {
    return res.json([]);
  }

  const data = fs.readFileSync(RFA_FILE, "utf-8");
  const assets = JSON.parse(data);
  res.json(assets);
});

// Endpoint สำหรับบันทึกข้อมูลสินทรัพย์ใหม่
app.post("/api/assets", (req, res) => {
  const newAsset = req.body;

  // ตรวจสอบว่าไฟล์ RFA.json มีอยู่หรือไม่
  let assets = [];
  if (fs.existsSync(RFA_FILE)) {
    const data = fs.readFileSync(RFA_FILE, "utf-8");
    assets = JSON.parse(data);
  }

  // เพิ่มสินทรัพย์ใหม่
  assets.push(newAsset);

  // เขียนข้อมูลกลับไปที่ RFA.json
  fs.writeFileSync(RFA_FILE, JSON.stringify(assets, null, 2));

  res.status(201).json({ message: "บันทึกข้อมูลสินทรัพย์สำเร็จ", asset: newAsset });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});