import React, { useState, useEffect } from 'react';
import './bar.css';
import api from '../utils/axios';

function Sidebar({ currentPage, showDocViewer, onNavigate, onDocViewer }) {
  // States for menu items and loading
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch menu configuration on component mount
  useEffect(() => {
    fetchMenuConfig();
  }, []);

  // Fetch menu configuration from backend
  const fetchMenuConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/menu/config');
      setMenuItems(response.data);
    } catch (err) {
      setError('Error loading menu: ' + err.message);
      // Fallback to default menu items if API fails
      setMenuItems(defaultMenuItems);
    } finally {
      setLoading(false);
    }
  };

  // Default menu items as fallback
  const defaultMenuItems = [
    { id: 'requisition', icon: '📝', text: 'ใบขอซื้อ' },
    { id: 'purchaseOrder', icon: '🛍️', text: 'ใบสั่งซื้อ' },
    { id: 'poReceipt', icon: '📦', text: 'รับสินค้า' },
    { id: 'invoice', icon: '📄', text: 'ตั้งหนี้' },
    { id: 'apBalance', icon: '💰', text: 'ยอดคงเหลือเจ้าหนี้' },
    { id: 'payment', icon: '💳', text: 'จ่ายเงิน' }
  ];

  // Handle navigation with logging
  const handleNavigate = async (page) => {
    try {
      await api.post('/api/navigation/log', {
        page,
        timestamp: new Date().toISOString()
      });
      onNavigate(page);
    } catch (err) {
      console.error('Navigation logging failed:', err);
      // Still navigate even if logging fails
      onNavigate(page);
    }
  };

  if (loading) {
    return <aside className="sidebar loading">Loading...</aside>;
  }

  return (
    <aside className="sidebar">
      {error && <div className="error-message">{error}</div>}
      
      <div className="logo-container">
        <h1>📊</h1>
      </div>

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
        
        {/* Document viewer button is always present */}
        <button 
          className={`nav-item ${showDocViewer ? 'active' : ''}`}
          onClick={onDocViewer}
        >
          <span className="icon">📋</span>
          <span className="text">จัดการเอกสาร</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;