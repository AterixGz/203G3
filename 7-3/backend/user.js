import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// สร้าง path สำหรับไฟล์ JSON
const dataDir = join(__dirname, '..', 'data');
const userDataPath = join(dataDir, 'users.json');

// สร้างโฟลเดอร์ data ถ้ายังไม่มี
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// สร้างไฟล์ users.json ถ้ายังไม่มี
if (!fs.existsSync(userDataPath)) {
    fs.writeFileSync(userDataPath, JSON.stringify({ users: [] }, null, 2));
}

// อ่านข้อมูล users จากไฟล์
const loadUsers = () => {
    try {
        const data = fs.readFileSync(userDataPath, 'utf8');
        return JSON.parse(data).users;
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
};

// บันทึกข้อมูล users ลงไฟล์
const saveUsers = (users) => {
    try {
        fs.writeFileSync(userDataPath, JSON.stringify({ users }, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

// เพิ่ม user ใหม่
const addUser = async (username, password) => {
    const users = loadUsers();
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password: hashedPassword,
        files: [],
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
};

// ตรวจสอบ login
const verifyUser = async (username, password) => {
    const users = loadUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
        throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Invalid password');
    }

    return user;
};

// ดึงข้อมูล user จาก username
const getUser = (username) => {
    const users = loadUsers();
    return users.find(u => u.username === username);
};

// อัพเดทข้อมูลไฟล์ของ user
const updateUserFiles = (username, files) => {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    users[userIndex].files = files;
    saveUsers(users);
};

export {
    loadUsers,
    addUser,
    verifyUser,
    getUser,
    updateUserFiles
};