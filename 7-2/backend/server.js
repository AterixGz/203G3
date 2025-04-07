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

// Endpoint สำหรับอัปเดตข้อมูลสินทรัพย์


// Path ของไฟล์ payments.json
const PAYMENTS_FILE = path.join(__dirname, "data", "payments.json");

// Endpoint สำหรับบันทึกข้อมูลการชำระเงิน
app.post("/api/payments", (req, res) => {
  const paymentData = req.body;

  // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
  if (!paymentData || Object.keys(paymentData).length === 0) {
    return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" });
  }

  let payments = [];

  // อ่านข้อมูลเดิมจาก payments.json
  if (fs.existsSync(PAYMENTS_FILE)) {
    const fileData = fs.readFileSync(PAYMENTS_FILE, "utf-8");
    payments = JSON.parse(fileData);
  }

  // เพิ่มข้อมูลใหม่
  payments.push(paymentData);

  // เขียนข้อมูลกลับไปที่ payments.json
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));

  res.status(201).json({ message: "บันทึกข้อมูลการชำระเงินสำเร็จ" });
});

// Endpoint สำหรับดึงข้อมูลการชำระเงินทั้งหมด
app.get("/api/payments", (req, res) => {
  // ตรวจสอบว่าไฟล์ payments.json มีอยู่หรือไม่
  if (!fs.existsSync(PAYMENTS_FILE)) {
    return res.status(404).json({ message: "ไม่พบไฟล์ payments.json" });
  }

  // อ่านข้อมูลจากไฟล์ payments.json
  const data = fs.readFileSync(PAYMENTS_FILE, "utf-8");
  const payments = JSON.parse(data);

  res.json(payments);
});

const INVOICES_FILE = path.join(__dirname, "data", "invoices.json");

// Endpoint สำหรับอัปเดตสถานะใบแจ้งหนี้หลังการชำระเงิน
app.post("/api/update-invoices", (req, res) => {
  const { payments } = req.body; // รับข้อมูลการชำระเงินที่ส่งมาจาก Frontend

  if (!fs.existsSync(INVOICES_FILE)) {
    return res.status(404).json({ message: "ไม่พบไฟล์ invoices.json" });
  }

  try {
    // อ่านข้อมูลใบแจ้งหนี้จากไฟล์
    const data = fs.readFileSync(INVOICES_FILE, "utf-8");
    let invoices = JSON.parse(data);

    // อัปเดตสถานะของใบแจ้งหนี้
    payments.forEach((payment) => {
      const invoice = invoices.find((inv) => inv.id === payment.invoiceId);
      if (invoice) {
        invoice.remainAmount -= payment.amount; // หักยอดที่ชำระออกจากยอดคงเหลือ
        if (invoice.remainAmount <= 0) {
          invoice.status = "ชำระแล้ว"; // หากยอดคงเหลือ <= 0 ให้เปลี่ยนสถานะเป็น "ชำระแล้ว"
          invoice.remainAmount = 0; // ป้องกันค่าติดลบ
        } else {
          invoice.status = "ชำระบางส่วน"; // หากยังมียอดคงเหลือ ให้เปลี่ยนสถานะเป็น "ชำระบางส่วน"
        }
      }
    });

    // เขียนข้อมูลกลับไปที่ไฟล์ invoices.json
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(invoices, null, 2));

    res.status(200).json({ message: "อัปเดตสถานะใบแจ้งหนี้สำเร็จ", invoices });
  } catch (error) {
    console.error("Error updating invoices:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตใบแจ้งหนี้" });
  }
});



// Endpoint สำหรับดึงข้อมูลสมาชิก
app.get("/api/members", (req, res) => {
  if (!fs.existsSync(USER_ROLE_FILE)) {
    return res.json({ users: [] });
  }

  const data = fs.readFileSync(USER_ROLE_FILE, "utf-8");
  const users = JSON.parse(data).users || [];
  res.json(users);
});

app.post("/api/members", (req, res) => {
  const newMember = req.body;

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วน (ยกเว้น id)
  if (!newMember.name || !newMember.username || !newMember.password || !newMember.role) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  let users = [];
  if (fs.existsSync(USER_ROLE_FILE)) {
    const data = fs.readFileSync(USER_ROLE_FILE, "utf-8");
    users = JSON.parse(data).users || [];
  }

  // คำนวณ id ใหม่โดยหาค่า id ที่มากที่สุดใน users แล้วเพิ่ม 1
  const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  // เพิ่ม id ให้กับสมาชิกใหม่
  const memberWithId = { ...newMember, id: newId };

  // เพิ่มสมาชิกใหม่ใน users
  users.push(memberWithId);

  // เขียนข้อมูลใหม่กลับไปที่ userRole.json
  fs.writeFileSync(USER_ROLE_FILE, JSON.stringify({ users }, null, 2));

  res.status(201).json({ message: "เพิ่มสมาชิกสำเร็จ", member: memberWithId });
});

// Endpoint สำหรับแก้ไขข้อมูลสมาชิก
app.put("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const updatedMember = req.body;

  // อ่านข้อมูลจากไฟล์ userRole.json
  const data = fs.readFileSync(USER_ROLE_FILE, "utf-8");
  let users = JSON.parse(data).users || [];

  // ค้นหาสมาชิกที่ต้องการแก้ไข
  const index = users.findIndex((user) => user.id === parseInt(id)); // แปลง id เป็นตัวเลข
  if (index === -1) {
    return res.status(404).json({ message: "ไม่พบสมาชิกที่ต้องการแก้ไข" });
  }

  // อัปเดตข้อมูลสมาชิก
  users[index] = { ...users[index], ...updatedMember };

  // เขียนข้อมูลใหม่กลับไปที่ userRole.json
  fs.writeFileSync(USER_ROLE_FILE, JSON.stringify({ users }, null, 2));

  res.status(200).json({ message: "แก้ไขข้อมูลสำเร็จ", member: users[index] });
});

// Endpoint สำหรับลบสมาชิก
app.delete("/api/members/:id", (req, res) => {
  const { id } = req.params;

  // ตรวจสอบว่าไฟล์ userRole.json มีอยู่หรือไม่
  if (!fs.existsSync(USER_ROLE_FILE)) {
    return res.status(404).json({ message: "ไม่พบไฟล์ userRole.json" });
  }

  // อ่านข้อมูลจากไฟล์ userRole.json
  const data = fs.readFileSync(USER_ROLE_FILE, "utf-8");
  let users = JSON.parse(data).users || [];

  // ค้นหาสมาชิกที่ต้องการลบ
  const userToDelete = users.find((user) => user.id === parseInt(id));

  // หากไม่พบสมาชิกที่ต้องการลบ
  if (!userToDelete) {
    return res.status(404).json({ message: "ไม่พบสมาชิกที่ต้องการลบ" });
  }

  // ป้องกันการลบผู้ใช้ที่มี role เป็น admin
  if (userToDelete.role === "admin") {
    return res.status(403).json({ message: "ไม่สามารถลบผู้ใช้ที่เป็น admin ได้" });
  }

  // กรองสมาชิกที่ต้องการลบออก
  const filteredUsers = users.filter((user) => user.id !== parseInt(id));

  // เขียนข้อมูลใหม่กลับไปที่ userRole.json
  fs.writeFileSync(USER_ROLE_FILE, JSON.stringify({ users: filteredUsers }, null, 2));

  res.status(200).json({ message: "ลบสมาชิกสำเร็จ" });
});

// กำหนด path ของไฟล์ PO.json
const PO_FILE = path.join(__dirname, "data", "Po.json");

// Endpoint สำหรับบันทึกข้อมูล PO
app.post("/api/purchase-orders", (req, res) => {
  const newPO = req.body;

  // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่
  if (!newPO || Object.keys(newPO).length === 0) {
    return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" });
  }

  // อ่านข้อมูลเดิมจาก Po.json
  let poData = [];
  if (fs.existsSync(PO_FILE)) {
    const fileData = fs.readFileSync(PO_FILE, "utf-8");
    poData = JSON.parse(fileData);
  }

  // เพิ่มข้อมูลใหม่
  poData.push(newPO);

  // เขียนข้อมูลกลับไปที่ Po.json
  fs.writeFileSync(PO_FILE, JSON.stringify(poData, null, 2));

  res.status(201).json({ message: "บันทึกข้อมูล PO สำเร็จ" });
});

// Endpoint สำหรับดึงข้อมูล PO ทั้งหมด
app.get("/api/purchase-orders", (req, res) => {
  if (!fs.existsSync(PO_FILE)) {
    return res.json([]);
  }

  const data = fs.readFileSync(PO_FILE, "utf-8");
  const poList = JSON.parse(data);
  res.json(poList);
});

// Endpoint สำหรับดึงข้อมูล PO ตาม poNumber
app.get("/api/purchase-orders/:poNumber", (req, res) => {
  const { poNumber } = req.params;

  if (!fs.existsSync(PO_FILE)) {
    return res.status(404).json({ message: "ไม่พบข้อมูล PO" });
  }

  const data = fs.readFileSync(PO_FILE, "utf-8");
  const poList = JSON.parse(data);
  const po = poList.find(p => p.poNumber === poNumber);

  if (!po) {
    return res.status(404).json({ message: "ไม่พบ PO ที่ระบุ" });
  }

  res.json(po);
});

// Endpoint สำหรับอัพเดตสถานะ PO
app.put("/api/purchase-orders/:poNumber", (req, res) => {
  const { poNumber } = req.params;
  const { status } = req.body;

  if (!fs.existsSync(PO_FILE)) {
    return res.status(404).json({ message: "ไม่พบข้อมูล PO" });
  }

  const data = fs.readFileSync(PO_FILE, "utf-8");
  let poList = JSON.parse(data);
  const poIndex = poList.findIndex(p => p.poNumber === poNumber);

  if (poIndex === -1) {
    return res.status(404).json({ message: "ไม่พบ PO ที่ระบุ" });
  }

  poList[poIndex].status = status;
  fs.writeFileSync(PO_FILE, JSON.stringify(poList, null, 2));

  res.json({ message: "อัพเดตสถานะ PO สำเร็จ" });
});

// Create cost_items table if it doesn't exist
const createCostItemsTable = `
CREATE TABLE IF NOT EXISTS cost_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  supplier VARCHAR(255) NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

connection.query(createCostItemsTable, (err) => {
  if (err) {
    console.error("Error creating cost_items table:", err);
  }
});

// GET endpoint to fetch all cost items
app.get("/cost-items", (req, res) => {
  const sql = "SELECT * FROM cost_items ORDER BY updatedAt DESC";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching cost items:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results);
  });
});

// POST endpoint to add new cost item
app.post("/cost-items", (req, res) => {
  const { name, unitPrice, supplier } = req.body;
  const sql = "INSERT INTO cost_items (name, unitPrice, supplier) VALUES (?, ?, ?)";

  connection.query(sql, [name, unitPrice, supplier], (err) => {
    if (err) {
      console.error("Error adding cost item:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
    }
    res.json({ message: "เพิ่มข้อมูลสำเร็จ" });
  });
});

// Update cost item
app.put("/cost-items/:id", (req, res) => {
  const { id } = req.params;
  const { name, unitPrice, supplier } = req.body;
  const sql = "UPDATE cost_items SET name = ?, unitPrice = ?, supplier = ? WHERE id = ?";
  
  connection.query(sql, [name, unitPrice, supplier, id], (err) => {
    if (err) {
      console.error("Error updating cost item:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  });
});

// Delete cost item
app.delete("/cost-items/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cost_items WHERE id = ?";
  
  connection.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting cost item:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
    res.json({ message: "ลบข้อมูลสำเร็จ" });
  });
});

// Update endpoints
app.get("/inventory-items", (req, res) => {
  const sql = "SELECT * FROM inventory_items ORDER BY updatedAt DESC";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching inventory items:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results);
  });
});

app.post("/inventory-items", (req, res) => {
  const { name, quantity, unitPrice, supplier } = req.body;
  const sql = "INSERT INTO inventory_items (name, quantity, unitPrice, supplier) VALUES (?, ?, ?, ?)";
  
  connection.query(sql, [name, quantity, unitPrice, supplier], (err) => {
    if (err) {
      console.error("Error adding inventory item:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
    }
    res.json({ message: "เพิ่มข้อมูลสำเร็จ" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});