import path from "path";
import fs from "fs";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "url"; // ใช้สำหรับหา __dirname ใน ES Module

const app = express();
const PORT = 3000;

// สร้าง __dirname สำหรับ ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "purchase_orders.json");
const INVENTORY_FILE = path.join(__dirname, "data", "InventoryReceiving.json");
const DISBURSEMENT_FILE = path.join(__dirname, "data", "InventoryDisbursement.json");

app.use(cors());
app.use(express.json());


app.post("/purchase-orders", (req, res) => {
  const newOrder = req.body;
  let orders = [];

  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    orders = JSON.parse(data);
  }

  orders.push(newOrder);
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
  res.json({ message: "บันทึกใบสั่งซื้อเรียบร้อยแล้ว" });
});

// อ่านข้อมูลการเบิกจ่ายพัสดุ
app.get("/inventory-disbursement", (req, res) => {
  if (!fs.existsSync(DISBURSEMENT_FILE)) {
    return res.json([]);
  }
  const data = fs.readFileSync(DISBURSEMENT_FILE, "utf-8");
  res.json(JSON.parse(data));
});


// อ่านข้อมูลการรับพัสดุ
app.get("/inventory-receiving", (req, res) => {
  if (!fs.existsSync(INVENTORY_FILE)) {
    return res.json([]);
  }
  const data = fs.readFileSync(INVENTORY_FILE, "utf-8");
  res.json(JSON.parse(data));
});

// บันทึกข้อมูลการรับพัสดุใหม่
app.post("/inventory-receiving", (req, res) => {
  const newReceiving = req.body;
  let inventory = [];

  if (fs.existsSync(INVENTORY_FILE)) {
    const data = fs.readFileSync(INVENTORY_FILE, "utf-8");
    inventory = JSON.parse(data);
  }

  inventory.push(newReceiving);
  fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
  res.json({ message: "บันทึกการรับพัสดุเรียบร้อยแล้ว" });
});



// บันทึกข้อมูลการเบิกจ่ายพัสดุใหม่
app.post("/inventory-disbursement", (req, res) => {
  const newDisbursement = req.body;
  let disbursements = [];

  if (fs.existsSync(DISBURSEMENT_FILE)) {
    const data = fs.readFileSync(DISBURSEMENT_FILE, "utf-8");
    disbursements = JSON.parse(data);
  }

  disbursements.push(newDisbursement);
  fs.writeFileSync(DISBURSEMENT_FILE, JSON.stringify(disbursements, null, 2));
  res.json({ message: "บันทึกการเบิกจ่ายพัสดุเรียบร้อยแล้ว" });
});





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});