const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authController = require('../controllers/authController');
const User = require('../models/usermodel'); // สมมติว่ามีโมเดลผู้ใช้สำหรับตรวจสอบข้อมูลผู้ใช้ในฐานข้อมูล
const router = express.Router();

// การลงทะเบียนผู้ใช้ (Register)
router.post('/register',authController.register, async (req, res) => {
    const { username, password, email } = req.body;
    
    try {
        // ตรวจสอบว่า username หรือ email ซ้ำกับที่มีอยู่ในฐานข้อมูลหรือไม่
        const userExist = await User.findOne({ where: { email } });
        if (userExist) return res.status(400).send('Email already exists');

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้างผู้ใช้ใหม่
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// การเข้าสู่ระบบผู้ใช้ (Login)
router.post('/login',authController.login, async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send('User not found');

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid password');

        // สร้าง JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET, // ให้แน่ใจว่า JWT_SECRET ถูกตั้งใน .env
            { expiresIn: '1h' } // Token หมดอายุใน 1 ชั่วโมง
        );

        res.json({ token }); // ส่ง token กลับไปให้กับผู้ใช้
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
