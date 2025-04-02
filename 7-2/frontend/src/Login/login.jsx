import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`เข้าสู่ระบบด้วย:
    ชื่อ: ${name}
    รหัส: ${id}
    อีเมล: ${email}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🚀 ระบบจัดการพัสดุ</h2>
        <h3>เข้าสู่ระบบ</h3>
        <p>กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

        <form onSubmit={handleSubmit}>
          <label>ชื่อ-นามสกุล</label>
          <input
            type="text"
            placeholder="ชื่อ นามสกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>รหัสประจำตัว</label>
          <input
            type="text"
            placeholder="รหัสประจำตัว"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />

          <label>อีเมล</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <div className="form-buttons">
            <button type="submit">เข้าสู่ระบบ</button>
            <button type="button" onClick={() => window.location.reload()}>ยกเลิก</button>
          </div>
        </form>

        <div className="test-credentials">
          <p>🛠 ข้อมูลสำหรับทดสอบ:</p>
          <p>ชื่อ: Admin User / รหัส: ADM001</p>
          <p>อีเมล: admin@example.com / รหัสผ่าน: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
