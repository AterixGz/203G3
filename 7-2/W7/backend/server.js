const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // ตรวจสอบให้แน่ใจว่าเส้นทางนี้ถูกต้อง
const prRoutes = require('./routes/prRoutes');
const poRoutes = require('./routes/poRoutes');
const poReceiptRoutes = require('./routes/poreceiptRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const balanceAfterPaymentRoutes = require('./routes/balanceAfterPaymentRoutes');
const paymentRoutes = require('./routes/payments');

dotenv.config();
const app = express();
app.use(express.json());



const mysql = require('mysql2');
const connection = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Database connected successfully!');
    }
});

console.log('Database Config:', process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);


// ตรวจสอบว่าไม่มีข้อผิดพลาดในการใช้งาน
app.use('/api/auth', authRoutes);
app.use('/api/pr', prRoutes);
app.use('/api/po', poRoutes);
app.use('/api/po-receipt', poReceiptRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/balance_after_payment', balanceAfterPaymentRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

