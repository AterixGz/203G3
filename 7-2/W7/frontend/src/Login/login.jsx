import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => { // รับ props onLogin
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      alert(`เข้าสู่ระบบสำเร็จ: ${response.data.user.username}`);
      onLogin(); // เรียกฟังก์ชัน onLogin เพื่อเปลี่ยนไปหน้าหลัก
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🚀 ระบบจัดการพัสดุ</h2>
        <h3>เข้าสู่ระบบ</h3>
        <p>กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

        <form onSubmit={handleSubmit}>
          <label>ชื่อผู้ใช้</label>
          <input
            type="text"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>รหัสผ่าน</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">เข้าสู่ระบบ</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="test-credentials">
          <p>🛠 ข้อมูลสำหรับทดสอบ:</p>
          <p>ชื่อผู้ใช้: admin / รหัสผ่าน: admin123</p>
          <p>ชื่อผู้ใช้: user / รหัสผ่าน: user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;