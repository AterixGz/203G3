const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
});

// ฟังก์ชั่นในการดึงข้อมูลทั้งหมดจากตาราง balances
const getAllBalances = (callback) => {
    connection.query('SELECT * FROM balances', (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// ฟังก์ชั่นในการเพิ่มข้อมูลใหม่ใน balances
const addBalance = (data, callback) => {
    const { invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, description } = data;

    connection.query(
        'INSERT INTO balances (invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, description],
        (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        }
    );
};

// ฟังก์ชั่นในการอัพเดตข้อมูล balances
const updateBalance = (id, data, callback) => {
    const { invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, description } = data;

    connection.query(
        'UPDATE balances SET invoice_number = ?, po_ref = ?, vendor = ?, invoice_date = ?, due_date = ?, total_amount = ?, paid_amount = ?, remaining_balance = ?, status = ?, description = ? WHERE id = ?',
        [invoice_number, po_ref, vendor, invoice_date, due_date, total_amount, paid_amount, remaining_balance, status, description, id],
        (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        }
    );
};

module.exports = { getAllBalances, addBalance, updateBalance };
