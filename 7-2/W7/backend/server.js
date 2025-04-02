const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', // ระบุโดเมนที่อนุญาต
}));

// กำหนดโฟลเดอร์สำหรับเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // โฟลเดอร์สำหรับเก็บไฟล์
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// ตรวจสอบประเภทไฟล์ที่อนุญาต
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // อนุญาตไฟล์
  } else {
    cb(new Error('กรุณาอัปโหลดไฟล์รูปภาพ (JPEG, PNG) หรือ PDF เท่านั้น'), false); // ปฏิเสธไฟล์
  }
};

const upload = multer({ storage, fileFilter });

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'csi2025eiei',
  database: process.env.DB_NAME || 'testing',
});

const mockUser = {
    username: 'john_doe',
    role: 'Super Admin', // เปลี่ยนเป็น  Super Admin,'Finance & Accounting', 'Procurement Officer' , 'Management & Approvers', หรือ 'IT Administrator'
  };
  
  // Middleware: ตรวจสอบบทบาทผู้ใช้
  function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {

      // หากบทบาทเป็น 'Super Admin' ให้เข้าถึงได้ทุก API
      if (mockUser.role === 'Super Admin') {
        return next();
    }

      if (!allowedRoles.includes(mockUser.role)) {
        return res.status(403).json({ message: 'Permission Denied' });
      }
      next();
    };
  }

// Routes

// Requisition API
app.post(
    '/requisition',
    authorizeRoles('Procurement Officer'),
    async (req, res) => {
      const { prNumber, requestDate, department, requester, purpose, items } = req.body;
      console.log('Request body:', req.body);
      try {
        const [result] = await db.query(
          'INSERT INTO requisitions (pr_number, request_date, department, requester, purpose) VALUES (?, ?, ?, ?, ?)',
          [prNumber, requestDate, department, requester, purpose]
        );
        const requisitionId = result.insertId;
  
        for (const item of items) {
          await db.query(
            'INSERT INTO requisition_items (requisition_id, details, quantity, unit_price) VALUES (?, ?, ?, ?)',
            [requisitionId, item.details, item.quantity, item.unitPrice]
          );
        }
  
        res.status(201).json({ message: 'Requisition created successfully', requisitionId });
      } catch (error) {
        console.error('Error in /requisition API:', error);
        res.status(500).json({ error: error.message });
      }
    }
  );

// Purchase Order API
app.post(
  '/purchase-order',
  authorizeRoles('Procurement Officer'),
  async (req, res) => {
    const { orderDate, vendor, items } = req.body;

    try {
      // ดึง PO Number ล่าสุดจากฐานข้อมูล
      const [rows] = await db.query('SELECT MAX(id) AS maxId FROM purchase_orders');
      const nextId = (rows[0].maxId || 0) + 1; // หากไม่มีข้อมูล ให้เริ่มจาก 1
      const poNumber = `PO-${String(nextId).padStart(6, '0')}`; // สร้าง PO Number เช่น PO-000001

      // บันทึกข้อมูลใบสั่งซื้อ
      const [result] = await db.query(
        'INSERT INTO purchase_orders (po_number, order_date, vendor) VALUES (?, ?, ?)',
        [poNumber, orderDate, vendor]
      );
      const purchaseOrderId = result.insertId;

      // บันทึกรายการสินค้า
      for (const item of items) {
        await db.query(
          'INSERT INTO purchase_order_items (purchase_order_id, name, quantity, price) VALUES (?, ?, ?, ?)',
          [purchaseOrderId, item.name, item.quantity, item.price]
        );
      }

      res.status(201).json({ message: 'Purchase Order created successfully', purchaseOrderId, poNumber });
    } catch (error) {
      console.error('Error in /purchase-order API:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.get('/next-po-number', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT MAX(id) AS maxId FROM purchase_orders');
    const nextId = (rows[0].maxId || 0) + 1;
    const poNumber = `PO-${String(nextId).padStart(6, '0')}`; // เช่น PO-000001
    res.json({ poNumber });
  } catch (error) {
    console.error('Error fetching next PO Number:', error);
    res.status(500).json({ error: error.message });
  }
});

// PO Receipt API
app.post('/po-receipt', async (req, res) => {
  const { poNumber, receiptDate, items } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO po_receipts (po_number, receipt_date) VALUES (?, ?)',
      [poNumber, receiptDate]
    );
    const receiptId = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO po_receipt_items (receipt_id, details, quantity) VALUES (?, ?, ?)',
        [receiptId, item.details, item.quantity]
      );
    }

    res.status(201).json({ message: 'PO Receipt created successfully', receiptId });
  } catch (error) {
    console.error('Error in /po-receipt API:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/next-receipt-number', async (req, res) => {
  try {
    // ดึง Receipt Number ล่าสุดจากฐานข้อมูล
    const [rows] = await db.query('SELECT MAX(id) AS maxId FROM po_receipts');
    const nextId = (rows[0].maxId || 0) + 1; // หากไม่มีข้อมูล ให้เริ่มจาก 1
    const receiptNumber = `REC${String(nextId).padStart(5, '0')}`; // เช่น REC00001
    res.json({ receiptNumber });
  } catch (error) {
    console.error('Error fetching next Receipt Number:', error);
    res.status(500).json({ error: error.message });
  }
});

// Invoice API
app.post('/invoice', upload.single('attachment'), async (req, res) => {
  const { invoiceNumber, invoiceDate, dueDate, poRef, vendor, items } = req.body;
  const attachment = req.file; // ไฟล์ที่แนบมา

  try {
    // เพิ่มข้อมูลใบแจ้งหนี้ในตาราง invoices
    const [result] = await db.query(
      'INSERT INTO invoices (invoice_number, invoice_date, due_date, po_ref, vendor, attachment_path) VALUES (?, ?, ?, ?, ?, ?)',
      [invoiceNumber, invoiceDate, dueDate, poRef, vendor, attachment?.path || null]
    );
    const invoiceId = result.insertId;

    // เพิ่มรายการสินค้าในตาราง invoice_items
    const parsedItems = JSON.parse(items);
    for (const item of parsedItems) {
      await db.query(
        'INSERT INTO invoice_items (invoice_id, details, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [invoiceId, item.details, item.quantity, item.unitPrice]
      );
    }

    // อัปเดต total_amount ในตาราง invoices
    await db.query(
      'UPDATE invoices SET total_amount = (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM invoice_items WHERE invoice_id = ?) WHERE id = ?',
      [invoiceId, invoiceId]
    );

    res.status(201).json({ message: 'Invoice created successfully', invoiceId });
  } catch (error) {
    console.error('Error in /invoice API:', error);
    res.status(500).json({ error: error.message });
  }
});
  
  // PUT API สำหรับอัปเดตรายการสินค้าใน invoice_items
  app.put('/invoice-items/:id', async (req, res) => {
    const { id } = req.params;
    const { details, quantity, unitPrice } = req.body;
    try {
      // อัปเดตรายการสินค้า
      await db.query(
        'UPDATE invoice_items SET details = ?, quantity = ?, unit_price = ? WHERE id = ?',
        [details, quantity, unitPrice, id]
      );
  
      // อัปเดต total_amount ในตาราง invoices
      const [rows] = await db.query(
        'SELECT invoice_id FROM invoice_items WHERE id = ?',
        [id]
      );
      const invoiceId = rows[0].invoice_id;
  
      await db.query(
        'UPDATE invoices SET total_amount = (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM invoice_items WHERE invoice_id = ?) WHERE id = ?',
        [invoiceId, invoiceId]
      );
  
      res.status(200).json({ message: 'Invoice item updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Payment API
app.post(
  '/payment',
  authorizeRoles('Finance & Accounting'),
  async (req, res) => {
    const { paymentNumber, paymentDate, method, bankAccount, notes, invoices } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO payments (payment_number, payment_date, method, bank_account, notes) VALUES (?, ?, ?, ?, ?)',
        [paymentNumber, paymentDate, method, bankAccount, notes]
      );
      const paymentId = result.insertId;

      for (const invoice of invoices) {
        // ตรวจสอบว่า invoice_number มีอยู่ในตาราง invoices หรือไม่
        const [existingInvoice] = await db.query(
          'SELECT * FROM invoices WHERE invoice_number = ?',
          [invoice.invoiceNumber]
        );
        if (existingInvoice.length === 0) {
          return res.status(400).json({
            error: `Invoice number ${invoice.invoiceNumber} does not exist`,
          });
        }

        // เพิ่มข้อมูลการชำระเงินใน payment_invoices
        await db.query(
          'INSERT INTO payment_invoices (payment_id, invoice_number, amount) VALUES (?, ?, ?)',
          [paymentId, invoice.invoiceNumber, invoice.amount]
        );

        // คำนวณ paid_amount ใหม่จากตาราง payment_invoices
        await db.query(
          'UPDATE invoices SET paid_amount = (SELECT COALESCE(SUM(amount), 0) FROM payment_invoices WHERE invoice_number = ?) WHERE invoice_number = ?',
          [invoice.invoiceNumber, invoice.invoiceNumber]
        );
      }

      res.status(201).json({ message: 'Payment recorded successfully', paymentId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// AP Balance API
app.get('/ap-balance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.invoice_number, 
        i.po_ref AS po_number,
        i.vendor, 
        i.invoice_date,
        i.due_date, 
        i.total_amount, 
        COALESCE(SUM(pi.amount), 0) AS paid_amount, 
        (i.total_amount - COALESCE(SUM(pi.amount), 0)) AS balance,
        CASE 
          WHEN (i.total_amount - COALESCE(SUM(pi.amount), 0)) = 0 THEN 'ชำระแล้ว'
          ELSE 'ยังไม่ชำระ'
        END AS status
      FROM invoices i
      LEFT JOIN payment_invoices pi ON i.invoice_number = pi.invoice_number
      GROUP BY i.invoice_number
    `);

    // ตรวจสอบว่า balance ถูกส่งกลับมาเป็นตัวเลข
    const formattedRows = rows.map(row => ({
      ...row,
      balance: parseFloat(row.balance), // แปลง balance เป็นตัวเลข
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error in /ap-balance API:', error);
    res.status(500).json({ error: error.message });
  }
});
  app.get(
    '/users',
    authorizeRoles('IT Administrator'),
    async (req, res) => {
      try {
        const [rows] = await db.query('SELECT id, username, role FROM users');
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});