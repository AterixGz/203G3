
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../config/db');

// exports.register = (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }

//     // Hash Password
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) return res.status(500).json({ error: 'Error hashing password' });

//         const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
//         db.query(query, [username, hashedPassword], (err, result) => {
//             if (err) return res.status(500).json({ error: 'Database error', details: err });

//             res.status(201).json({ message: 'User registered', userId: result.insertId });
//         });
//     });
// };

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// REGISTER
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // บันทึกผู้ใช้ใหม่
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error', details: err });
                res.status(201).json({ message: 'User registered', userId: result.insertId });
            }
        );
    });
};

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // สร้าง JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
};
