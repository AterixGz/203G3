import React, { useState, useEffect } from 'react';
import './bar.css';
import api from '../utils/axios';

function Sidebar({ currentPage, showDocViewer, onNavigate, onDocViewer }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuConfig();
  }, []);

  const fetchMenuConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/menu/config');
      setMenuItems(response.data);
    } catch (err) {
      setError('Error loading menu: ' + err.message);
      setMenuItems(defaultMenuItems);
    } finally {
      setLoading(false);
    }
  };

  const defaultMenuItems = [
    { id: 'requisition', icon: '🗒', text: 'ใบขอซื้อ' },
    { id: 'purchaseOrder', icon: '🗏', text: 'ใบสั่งซื้อ' },
    { id: 'poReceipt', icon: '🗐', text: 'รับสินค้า' },
    { id: 'invoice', icon: '🗎', text: 'ตั้งหนี้' },
    { id: 'apBalance', icon: '☰', text: 'ยอดคงเหลือเจ้าหนี้' },
    { id: 'payment', icon: '$', text: 'จ่ายเงิน' }
  ];

  const handleNavigate = async (page) => {
    try {
      await api.post('/api/navigation/log', {
        page,
        timestamp: new Date().toISOString()
      });
      onNavigate(page);
    } catch (err) {
      console.error('Navigation logging failed:', err);
      onNavigate(page);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/logout'); // เรียก API สำหรับ Logout
      localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
      window.location.href = '/login'; // เปลี่ยนเส้นทางไปยังหน้า Login
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return <aside className="sidebar loading">Loading...</aside>;
  }

  return (
    <aside className="sidebar">
      {error && <div className="error-message">{error}</div>}

      <nav className="nav-menu">
        {menuItems.map(item => (
          <button 
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.text}</span>
          </button>
        ))}

        <button 
          className={`nav-item ${showDocViewer ? 'active' : ''}`}
          onClick={onDocViewer}
        >
          <span className="icon">⎙</span>
          <span className="text">จัดการเอกสาร</span>
        </button>

        {/* ปุ่ม Logout */}
        <button 
          className="nav-item logout"
          onClick={handleLogout}
        >
          <span className="icon">🚪</span>
          <span className="text">ออกจากระบบ</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;