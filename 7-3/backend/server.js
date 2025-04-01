import path from "path";
import fs from "fs";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "url"; // ใช้สำหรับหา __dirname ใน ES Module
import mysql from "mysql2";

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: "yamanote.proxy.rlwy.net",      // ที่อยู่ของฐานข้อมูล
  user: "root",           // ชื่อผู้ใช้ MySQL
  password: "qmPOypIUaSWGTMuZgOnkzXprDKmnAKJd",   // รหัสผ่าน MySQL
  database: "railway", // ชื่อฐานข้อมูล
  port: "47001"
});
const app = express();
const PORT = 3000;

// สร้าง __dirname สำหรับ ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const DATA_FILE = path.join(__dirname, "purchase_orders.json");
// const INVENTORY_FILE = path.join(__dirname, "data", "InventoryReceiving.json");
const DISBURSEMENT_FILE = path.join(__dirname, "data", "InventoryDisbursement.json");

app.use(cors());
app.use(express.json());


connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.post("/purchase-orders", (req, res) => {
  const { poNumber, date, supplier_name, selectedPR, items, total } = req.body;

  const sql = "INSERT INTO purchase_orders (po_number, date, supplier_name, pr_id, total) VALUES (?, ?, ?, ?, ?)";
  connection.query(sql, [poNumber, date, supplier_name, selectedPR, total], (err, result) => {
    if (err) {
      console.error("Error inserting purchase order: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกใบสั่งซื้อ" });
    }

    const poId = result.insertId;
    const itemSql = "INSERT INTO purchase_items (po_id, pr_id, name, quantity, unit_price, total) VALUES ?";
    const itemValues = items.map(item => [poId, selectedPR, item.name, item.quantity, item.unitPrice, item.total]);

    connection.query(itemSql, [itemValues], (err) => {
      if (err) {
        console.error("Error inserting purchase items: ", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกรายการสินค้า" });
      }
      res.json({ message: "บันทึกใบสั่งซื้อสำเร็จ" });
    });
  });
});

// API สำหรับดึงข้อมูลใบสั่งซื้อ
app.get("/purchase-orders", (req, res) => {
  const sql = "SELECT * FROM purchase_orders";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching purchase orders: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลใบสั่งซื้อ" });
    }
    res.json(results);
  });
});

// API สำหรับดึงรายการสินค้าตามใบสั่งซื้อที่เลือก
app.get("/purchase-items/:po_id", (req, res) => {
  const { po_id } = req.params;
  const sql = "SELECT * FROM purchase_items WHERE po_id = ?";
  connection.query(sql, [po_id], (err, results) => {
    if (err) {
      console.error("Error fetching purchase items: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลรายการสินค้า" });
    }
    res.json(results);
  });
});


// บันทึกข้อมูลการรับพัสดุใหม่
app.post("/inventory-receiving", (req, res) => {
  const newReceiving = req.body;
  console.log("Request body:", newReceiving);
  const query = `INSERT INTO inventory_receiving (item_id, receiptNumber, date, deliveryNote, selectedPO) VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [newReceiving.item_id, newReceiving.receiptNumber, newReceiving.date, newReceiving.deliveryNote, newReceiving.selectedPO], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    } 
    res.json({ message: "บันทึกการรับพัสดุเรียบร้อยแล้ว" });
  });
});


// อ่านข้อมูลคลังสินค้า
app.get("/inventory", (req, res) => {
  connection.query("SELECT * FROM inventory_items", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(result)
  })
})

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
  const query = "SELECT * FROM inventory_receiving"; // คำสั่ง SQL เพื่อดึงข้อมูลทั้งหมดจากตาราง inventory_receiving

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving data: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results); // ส่งผลลัพธ์กลับเป็น JSON
  });
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

process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error("Error closing connection: ", err);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});