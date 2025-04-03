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

// กำหนดโฟลเดอร์สำหรับเก็บไฟล์ Invoice
const invoiceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/invoices')); // โฟลเดอร์สำหรับ Invoice
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const invoiceUpload = multer({
  storage: invoiceStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('กรุณาอัปโหลดไฟล์รูปภาพ (JPEG, PNG) หรือ PDF เท่านั้น'), false);
    }
  },
});

// API สำหรับการสร้าง Invoice
app.post('/api/invoices', upload.single('invoiceFile'), async (req, res) => {
  const { invoiceNumber, invoiceDate, dueDate, poRef, vendor, items } = req.body;
  const attachmentPath = req.file ? req.file.path : null;

  try {
    // Insert invoice data
    const [result] = await db.query(
      'INSERT INTO invoices (invoice_number, invoice_date, due_date, po_ref, vendor, attachment_path) VALUES (?, ?, ?, ?, ?, ?)',
      [invoiceNumber, invoiceDate, dueDate, poRef, vendor, attachmentPath]
    );
    const invoiceId = result.insertId;

    // Insert invoice items
    const parsedItems = JSON.parse(items);
    for (const item of parsedItems) {
      await db.query(
        'INSERT INTO invoice_items (invoice_id, details, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?)',
        [invoiceId, item.itemDetails, item.currentInvoiceQuantity, item.unitPrice, item.totalAmount]
      );
    }

    // Update total amount in invoices table
    await db.query(
      'UPDATE invoices SET total_amount = (SELECT COALESCE(SUM(total_amount), 0) FROM invoice_items WHERE invoice_id = ?) WHERE id = ?',
      [invoiceId, invoiceId]
    );

    res.status(201).json({ message: 'Invoice created successfully', invoiceId });
  } catch (error) {
    console.error('Error in /api/invoices API:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices', async (req, res) => {
  const { status, search } = req.query;

  try {
    let query = `
      SELECT 
        id, 
        invoice_number AS invoiceNumber, 
        DATE_FORMAT(invoice_date, '%Y-%m-%d') AS invoiceDate, 
        total_amount AS amount, 
        vendor AS vendorName 
      FROM invoices 
      WHERE (total_amount - paid_amount) > 0
    `;
    const params = [];

    if (status === 'pending') {
      query += ' AND (total_amount - paid_amount) > 0';
    }

    if (search) {
      query += ' AND (invoice_number LIKE ? OR vendor LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purchase-orders/:id/items', async (req, res) => {
  const { id } = req.params;

  try {
    // ดึงข้อมูลใบสั่งซื้อ
    const [poRows] = await db.query(
      'SELECT vendor_name, status FROM purchase_orders WHERE id = ?',
      [id]
    );

    if (poRows.length === 0) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    // ดึงรายการสินค้าในใบสั่งซื้อ
    const [itemRows] = await db.query(
      `SELECT 
        name AS description, 
        quantity AS receivedQuantity, 
        price 
      FROM purchase_order_items 
      WHERE purchase_order_id = ?`,
      [id]
    );

    res.status(200).json({
      vendorName: poRows[0].vendor_name,
      status: poRows[0].status,
      items: itemRows,
    });
  } catch (error) {
    console.error('Error in /api/purchase-orders/:id/items API:', error);
    res.status(500).json({ error: error.message });
  }
});

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/payments')); // โฟลเดอร์สำหรับ Payment
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const paymentUpload = multer({
  storage: paymentStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('กรุณาอัปโหลดไฟล์รูปภาพ (JPEG, PNG) หรือ PDF เท่านั้น'), false);
    }
  },
});

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'csi2025eiei',
  database: process.env.DB_NAME || 'mini',
});

// Routes

// Requisition API
app.get('/requisition/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [requisitionRows] = await db.query(
      'SELECT * FROM requisitions WHERE id = ?',
      [id]
    );
    const [itemRows] = await db.query(
      'SELECT * FROM requisition_items WHERE requisition_id = ?',
      [id]
    );

    if (requisitionRows.length === 0) {
      return res.status(404).json({ message: 'Requisition not found' });
    }

    res.status(200).json({
      ...requisitionRows[0],
      items: itemRows,
    });
  } catch (error) {
    console.error('Error fetching requisition:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/requisition', async (req, res) => {
  const { prNumber, requestDate, creator, vendorName, vendorContact, description, status, paymentTerms, refPR, items } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO requisitions (pr_number, request_date, creator, vendor_name, vendor_contact, description, status, payment_terms, ref_pr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [prNumber, requestDate, creator, vendorName, vendorContact, description, status, paymentTerms, refPR]
    );

    const requisitionId = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO requisition_items (requisition_id, description, unit, required_date, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
        [requisitionId, item.description, item.unit, item.requiredDate, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: 'Requisition created successfully', requisitionId });
  } catch (error) {
    console.error('Error creating requisition:', error);
    res.status(500).json({ error: error.message });
  }
});

// API สำหรับดึงข้อมูลใบขอซื้อทั้งหมด
app.get('/api/requisitions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, pr_number AS requisition_number, vendor_name FROM requisitions');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching requisitions:', error);
    res.status(500).json({ error: error.message });
  }
});

// API สำหรับดึงข้อมูลใบขอซื้อเฉพาะรายการ
app.get('/api/requisition/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [requisitionRows] = await db.query(
      'SELECT * FROM requisitions WHERE id = ?',
      [id]
    );
    const [itemRows] = await db.query(
      'SELECT * FROM requisition_items WHERE requisition_id = ?',
      [id]
    );

    if (requisitionRows.length === 0) {
      return res.status(404).json({ message: 'Requisition not found' });
    }

    res.status(200).json({
      ...requisitionRows[0],
      items: itemRows,
    });
  } catch (error) {
    console.error('Error fetching requisition:', error);
    res.status(500).json({ error: error.message });
  }
});

// Purchase Order API
app.post('/api/purchase-orders', async (req, res) => {
  const { poNumber, orderDate, requisitionRef, vendorName, status, items, totalAmount, submittedAt } = req.body;

  try {
    // บันทึกข้อมูลใบสั่งซื้อ
    const [result] = await db.query(
      'INSERT INTO purchase_orders (po_number, order_date, requisition_ref, vendor_name, status, total_amount, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [poNumber, orderDate, requisitionRef, vendorName, status, totalAmount, submittedAt]
    );
    const purchaseOrderId = result.insertId;

    // บันทึกรายการสินค้า
    for (const item of items) {
      await db.query(
        'INSERT INTO purchase_order_items (purchase_order_id, name, quantity, price) VALUES (?, ?, ?, ?)',
        [purchaseOrderId, item.name, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: 'Purchase Order created successfully', purchaseOrderId });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purchase-orders', async (req, res) => {
  try {
    // ดึงข้อมูลใบสั่งซื้อที่มีสถานะ "approved"
    const [rows] = await db.query(
      'SELECT id, po_number, vendor_name FROM purchase_orders WHERE status = "approved"'
    );
    res.status(200).json(rows); // ส่งข้อมูลกลับไปยังฟรอนต์เอนด์
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: error.message });
  }
});


// app.get('/next-po-number', async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT MAX(id) AS maxId FROM purchase_orders');
//     const nextId = (rows[0].maxId || 0) + 1;
//     const poNumber = `PO-${String(nextId).padStart(6, '0')}`; // เช่น PO-000001
//     res.json({ poNumber });
//   } catch (error) {
//     console.error('Error fetching next PO Number:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// PO Receipt API
app.post('/po-receipt', async (req, res) => {
  const { receiptNumber, poNumber, receiptDate, items } = req.body;

  // ตรวจสอบข้อมูลที่ส่งมาจาก frontend
  if (!receiptNumber || !poNumber || !receiptDate || !Array.isArray(items)) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    // บันทึกข้อมูล PO Receipt ลงในตาราง `po_receipts`
    const [result] = await db.query(
      'INSERT INTO po_receipts (receipt_number, po_number, receipt_date) VALUES (?, ?, ?)',
      [receiptNumber, poNumber, receiptDate]
    );
    const receiptId = result.insertId;

    // บันทึกรายการสินค้าในตาราง `po_receipt_items`
    for (const item of items) {
      const { details, quantity, unit } = item;

      if (!details || typeof quantity !== 'number' || !unit) {
        return res.status(400).json({ message: 'ข้อมูลรายการสินค้าไม่ถูกต้อง' });
      }

      await db.query(
        'INSERT INTO po_receipt_items (receipt_id, details, quantity, unit) VALUES (?, ?, ?, ?)',
        [receiptId, details, quantity, unit]
      );
    }

    res.status(201).json({ message: 'PO Receipt created successfully', receiptId });
  } catch (error) {
    console.error('Error in /po-receipt API:', error);
    res.status(500).json({ error: error.message });
  }
});

// API สำหรับการสร้าง Invoice
app.post('/api/invoices', invoiceUpload.single('invoiceFile'), async (req, res) => {
  const { invoiceNumber, invoiceDate, dueDate, poRef, vendor, items } = req.body;
  const attachmentPath = req.file ? req.file.path : null;

  try {
    // Insert invoice data
    const [result] = await db.query(
      'INSERT INTO invoices (invoice_number, invoice_date, due_date, po_ref, vendor, attachment_path) VALUES (?, ?, ?, ?, ?, ?)',
      [invoiceNumber, invoiceDate, dueDate, poRef, vendor, attachmentPath]
    );
    const invoiceId = result.insertId;

    // Insert invoice items
    const parsedItems = JSON.parse(items);
    for (const item of parsedItems) {
      await db.query(
        'INSERT INTO invoice_items (invoice_id, details, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?)',
        [invoiceId, item.itemDetails, item.currentInvoiceQuantity, item.unitPrice, item.totalAmount]
      );
    }

    // Update total amount in invoices table
    await db.query(
      'UPDATE invoices SET total_amount = (SELECT COALESCE(SUM(total_amount), 0) FROM invoice_items WHERE invoice_id = ?) WHERE id = ?',
      [invoiceId, invoiceId]
    );

    res.status(201).json({ message: 'Invoice created successfully', invoiceId });
  } catch (error) {
    console.error('Error in /api/invoices API:', error);
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

  app.get('/api/invoices', async (req, res) => {
    const { status, search } = req.query;
  
    try {
      let query = `
        SELECT 
          id, 
          invoice_number AS invoiceNumber, 
          DATE_FORMAT(invoice_date, '%Y-%m-%d') AS invoiceDate, 
          total_amount AS amount, 
          vendor AS vendorName 
        FROM invoices 
        WHERE status = "ยังไม่ชำระ"
      `;
      const params = [];
  
      if (search) {
        query += ' AND (invoice_number LIKE ? OR vendor LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
  
      const [rows] = await db.query(query, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: error.message });
    }
  });

// API สำหรับการบันทึก Payment
app.post('/api/payments', paymentUpload.single('attachment'), async (req, res) => {
  const { paymentNumber, paymentDate, paymentMethod, bankAccount, notes, invoices } = req.body;
  const attachmentPath = req.file ? req.file.path : null;

  try {
    const [result] = await db.query(
      'INSERT INTO payments (payment_number, payment_date, method, bank_account, notes, attachment_path) VALUES (?, ?, ?, ?, ?, ?)',
      [paymentNumber, paymentDate, paymentMethod, bankAccount, notes, attachmentPath]
    );
    const paymentId = result.insertId;

    const invoiceList = JSON.parse(invoices); // รับข้อมูล invoices จาก frontend
    for (const invoiceId of invoiceList) {
      const [invoice] = await db.query('SELECT invoice_number, total_amount, paid_amount FROM invoices WHERE id = ?', [invoiceId]);
      if (invoice.length === 0) {
        throw new Error(`Invoice with ID ${invoiceId} does not exist`);
      }

      const invoiceNumber = invoice[0].invoice_number;
      const totalAmount = parseFloat(invoice[0].total_amount);
      const paidAmount = parseFloat(invoice[0].paid_amount);

      if (isNaN(paidAmount) || isNaN(totalAmount)) {
        throw new Error(`Invalid numeric value for paidAmount (${paidAmount}) or totalAmount (${totalAmount})`);
      }

      // เพิ่มข้อมูลใน payment_invoices
      await db.query(
        'INSERT INTO payment_invoices (payment_id, invoice_id, invoice_number) VALUES (?, ?, ?)',
        [paymentId, invoiceId, invoiceNumber]
      );

      // อัปเดตยอดชำระเงินใน invoices
      const newPaidAmount = paidAmount + totalAmount;
      await db.query(
        'UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?',
        [newPaidAmount, newPaidAmount >= totalAmount ? 'ชำระแล้ว' : 'ยังไม่ชำระ', invoiceId]
      );
    }

    res.status(201).json({ message: 'Payment recorded successfully', paymentId });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/invoices', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        invoice_number, 
        vendor, 
        total_amount, 
        paid_amount, 
        (total_amount - paid_amount) AS balance 
      FROM invoices
      WHERE (total_amount - paid_amount) > 0
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

// AP Balance API
app.get('/api/ap-balance', async (req, res) => {
  try {
    const { vendor, status, startDate, endDate } = req.query;

    let query = `
      SELECT 
        i.invoice_number, 
        i.po_ref AS po_number,
        i.vendor, 
        DATE_FORMAT(i.invoice_date, '%Y-%m-%d') AS invoice_date,
        DATE_FORMAT(i.due_date, '%Y-%m-%d') AS due_date,
        i.total_amount, 
        i.paid_amount, 
        (i.total_amount - i.paid_amount) AS balance,
        CASE 
          WHEN (i.total_amount - i.paid_amount) = 0 THEN 'ชำระแล้ว'
          ELSE 'ยังไม่ชำระ'
        END AS status
      FROM invoices i
      WHERE 1=1
    `;

    const params = [];
    if (vendor) {
      query += ' AND i.vendor LIKE ?';
      params.push(`%${vendor}%`);
    }
    if (status) {
      query += ' AND (CASE WHEN (i.total_amount - i.paid_amount) = 0 THEN "ชำระแล้ว" ELSE "ยังไม่ชำระ" END) = ?';
      params.push(status);
    }
    if (startDate) {
      query += ' AND i.invoice_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND i.invoice_date <= ?';
      params.push(endDate);
    }

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching AP Balance:', error);
    res.status(500).json({ error: error.message });
  }
});

 // API สำหรับดึงข้อมูลผู้ใช้ทั้งหมด พร้อม role name
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, 
        u.username, 
        r.name AS role 
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API สำหรับการเข้าสู่ระบบ
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, 
        u.username, 
        r.name AS role 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = ? AND u.password = ?
    `, [username, password]);

    if (rows.length > 0) {
      res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', user: rows[0] });
    } else {
      res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('Error in /login API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});