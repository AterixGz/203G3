
import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`เข้าสู่ระบบด้วยอีเมล: ${email}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🚀 ระบบจัดการพัสดุ</h2>
        <h3>เข้าสู่ระบบ</h3>
        <p>กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

        <form onSubmit={handleSubmit}>
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

          <div className="forgot-password">
            <a href="#">ลืมรหัสผ่าน?</a>
          </div>

          <button type="submit">เข้าสู่ระบบ</button>
        </form>

        <div className="test-credentials">
          <p>🛠 ข้อมูลสำหรับทดสอบ:</p>
          <p>อีเมล: admin@example.com / รหัสผ่าน: admin123</p>
          <p>อีเมล: user@example.com / รหัสผ่าน: user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
