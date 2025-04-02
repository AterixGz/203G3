const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', // ระบุโดเมนที่อนุญาต
}));

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
      const { poNumber, orderDate, vendor, items } = req.body;
      try {
        const [result] = await db.query(
          'INSERT INTO purchase_orders (po_number, order_date, vendor) VALUES (?, ?, ?)',
          [poNumber, orderDate, vendor]
        );
        const purchaseOrderId = result.insertId;
  
        for (const item of items) {
          await db.query(
            'INSERT INTO purchase_order_items (purchase_order_id, name, quantity, price) VALUES (?, ?, ?, ?)',
            [purchaseOrderId, item.name, item.quantity, item.price]
          );
        }
  
        res.status(201).json({ message: 'Purchase Order created successfully', purchaseOrderId });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

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
    res.status(500).json({ error: error.message });
  }
});

// Invoice API
app.post('/invoice', async (req, res) => {
  const { invoices } = req.body; // รับข้อมูล invoices เป็น array
  try {
    for (const invoice of invoices) {
      const { invoiceNumber, invoiceDate, dueDate, poRef, vendor, items } = invoice;

      // เพิ่มข้อมูลใบแจ้งหนี้ในตาราง invoices
      const [result] = await db.query(
        'INSERT INTO invoices (invoice_number, invoice_date, due_date, po_ref, vendor) VALUES (?, ?, ?, ?, ?)',
        [invoiceNumber, invoiceDate, dueDate, poRef, vendor]
      );
      const invoiceId = result.insertId;

      // เพิ่มรายการสินค้าในตาราง invoice_items
      for (const item of items) {
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
    }

    res.status(201).json({ message: 'Invoices created successfully' });
  } catch (error) {
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
app.get(
  '/ap-balance',
  authorizeRoles('Management & Approvers'),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          i.invoice_number, 
          i.vendor, 
          i.due_date, 
          i.total_amount, 
          COALESCE(SUM(pi.amount), 0) AS paid_amount, 
          (i.total_amount - COALESCE(SUM(pi.amount), 0)) AS balance
        FROM invoices i
        LEFT JOIN payment_invoices pi ON i.invoice_number = pi.invoice_number
        GROUP BY i.invoice_number
      `);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
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