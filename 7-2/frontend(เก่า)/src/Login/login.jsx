import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      alert(`เข้าสู่ระบบสำเร็จ: ${response.data.message}`);
      onLogin(); // เปลี่ยนสถานะ isLoggedIn ใน App
      navigate("/requisition"); // นำทางไปยังหน้า Requisition
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
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
            placeholder="ชื่อผู้ใช้"
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

          {error && <p className="error-message">{error}</p>}

          <div className="form-buttons">
            <button type="submit">เข้าสู่ระบบ</button>
            <button type="button" onClick={() => window.location.reload()}>
              ยกเลิก
            </button>
          </div>
        <div className="test-credentials">
          <p>🛠 ข้อมูลสำหรับทดสอบ:</p>
          <p>Procurement Officer</p>
          <p>procurement รหัสผ่าน: password123</p>
          <p>Finance & Accounting</p>
          <p>finance  รหัสผ่าน: password123</p>
          <p>Management & Approvers</p>
          <p>manager  รหัสผ่าน: password123</p>
          <p>IT Administrator</p>
          <p>itadmin  รหัสผ่าน: password123</p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
