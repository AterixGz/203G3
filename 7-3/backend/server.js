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
  const { poNumber, date, supplier_name, requiredDate, requester, branch, items, total } = req.body;
  console.log("Request body:", req.body);

  const sql = "INSERT INTO purchase_orders (po_number, date, requiredDate, supplier_name, requester, branch, total) VALUES (?, ?, ?, ?, ?, ?, ?)";
  connection.query(sql, [poNumber, date, requiredDate, supplier_name, requester, branch, total], (err, result) => {
    if (err) {
      console.error("Error inserting purchase order: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกใบสั่งซื้อ" });
    }

    const poId = result.insertId;
    const itemSql = "INSERT INTO purchase_items (po_id, name, description, quantity, unit_price, total) VALUES ?";
    const itemValues = items.map(item => [poId, item.name, item.description, item.quantity, item.unitPrice, item.total]);

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
app.get("/purchase-orders/:po_id", (req, res) => {
  const { po_id } = req.params;

  const sql = "SELECT * FROM purchase_orders WHERE id = ?"; // <-- เช็คให้แน่ใจว่าใช้ `id`
  
  connection.query(sql, [po_id], (err, results) => {
    if (err) {
      console.error("Error fetching purchase order: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลใบสั่งซื้อ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบใบสั่งซื้อที่ต้องการ" });
    }

    res.json(results[0]); // ส่งใบสั่งซื้อเพียงรายการเดียว
  });
});


app.get("/purchase-items/:po_id", (req, res) => {
  const { po_id } = req.params;

  const sql = "SELECT * FROM purchase_items WHERE po_id = ?"; // <-- ตรวจสอบว่ามีคอลัมน์ `po_id` จริงหรือไม่

  connection.query(sql, [po_id], (err, results) => {
    if (err) {
      console.error("Error fetching purchase items: ", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลรายการสินค้า" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบรายการสินค้าในใบสั่งซื้อนี้" });
    }

    res.json(results);
  });
});

// API สำหรับบันทึกการรับพัสดุและรายการสินค้า
app.post('/inventory-receiving', (req, res) => {
  const { receiptNumber, deliveryNote } = req.body;

  connection.beginTransaction((err) => {
    if (err) {
      console.error('Transaction begin error:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }

    // บันทึกข้อมูลลงในตาราง inventory_receiving เฉพาะ receiptNumber และ deliveryNote
    connection.query(
      'INSERT INTO inventory_receiving (receipt_number, delivery_note) VALUES (?, ?)',
      [receiptNumber, deliveryNote],
      (err, receivingResult) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error inserting inventory_receiving:', err);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
          });
        }

        const receivingId = receivingResult.insertId;

        if (req.body.items && req.body.items.length > 0) {
          let itemsProcessed = 0;
          let itemsError = false;

          req.body.items.forEach((item) => {
            connection.query(
              'INSERT INTO inventory_items (receiving_id, item_id, po_id, received_quantity, total, storage_location ,unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [receivingId, item.id, req.body.selectedPO, item.received, item.unit_price * item.received, item.storageLocation, item.unit_price],
              (err) => {
                itemsProcessed++;
                if (err) {
                  itemsError = true;
                  return connection.rollback(() => {
                    console.error('Error inserting inventory_items:', err);
                    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
                  });
                }

                if (itemsProcessed === req.body.items.length && !itemsError) {
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        console.error('Transaction commit error:', err);
                        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
                      });
                    }
                    res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ' });
                  });
                }
              }
            );
          });
        } else {
          // หากไม่มี items ให้ commit transaction เลย
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Transaction commit error:', err);
                res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
              });
            }
            res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ' });
          });
        }
      }
    );
  });
});
// อ่านข้อมูลคลังสินค้า
app.get("/inventory", (req, res) => {
  connection.query("SELECT * FROM inventory_items", (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

app.get("/inventory-items/search", (req, res) => {
  const searchTerm = req.query.searchTerm;
  const query = `SELECT * FROM inventory_items WHERE item_id LIKE '%${searchTerm}%' OR receiving_id LIKE '%${searchTerm}%'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
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