const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'asset_management',
});

// Routes

// Requisition API
app.post('/requisition', async (req, res) => {
  const { prNumber, requestDate, department, requester, purpose, items } = req.body;
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
    res.status(500).json({ error: error.message });
  }
});

// Purchase Order API
app.post('/purchase-order', async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// Invoice API
app.post('/invoice', async (req, res) => {
  const { invoiceNumber, invoiceDate, dueDate, poRef, vendor, items } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO invoices (invoice_number, invoice_date, due_date, po_ref, vendor) VALUES (?, ?, ?, ?, ?)',
      [invoiceNumber, invoiceDate, dueDate, poRef, vendor]
    );
    const invoiceId = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO invoice_items (invoice_id, details, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [invoiceId, item.details, item.quantity, item.unitPrice]
      );
    }

    res.status(201).json({ message: 'Invoice created successfully', invoiceId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment API
app.post('/payment', async (req, res) => {
  const { paymentNumber, paymentDate, method, bankAccount, notes, invoices } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO payments (payment_number, payment_date, method, bank_account, notes) VALUES (?, ?, ?, ?, ?)',
      [paymentNumber, paymentDate, method, bankAccount, notes]
    );
    const paymentId = result.insertId;

    for (const invoice of invoices) {
      await db.query(
        'INSERT INTO payment_invoices (payment_id, invoice_number, amount) VALUES (?, ?, ?)',
        [paymentId, invoice.invoiceNumber, invoice.amount]
      );
    }

    res.status(201).json({ message: 'Payment recorded successfully', paymentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AP Balance API
app.get('/ap-balance', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT invoice_number, vendor, due_date, total_amount, paid_amount, (total_amount - paid_amount) AS balance FROM invoices'
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});