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

app.use(cors());
app.use(express.json());

// อ่านข้อมูลใบสั่งซื้อ
app.get("/purchase-orders", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json([]);
  }
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  res.json(JSON.parse(data));
});

// บันทึกใบสั่งซื้อใหม่
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});