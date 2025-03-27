// components/Sidebar.jsx
import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  LogOut, 
  RefreshCw 
} from 'react-feather';

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'purchase-order', label: 'ใบสั่งซื้อ', icon: <ShoppingCart /> },
    { id: 'receiving', label: 'รับพัสดุเข้าคลัง', icon: <Package /> },
    { id: 'unit-cost', label: 'ต้นทุนต่อหน่วย', icon: <DollarSign /> },
    { id: 'disbursement', label: 'เบิกจ่ายพัสดุ', icon: <LogOut /> },
    { id: 'auto-requisition', label: 'ขอซื้ออัตโนมัติ', icon: <RefreshCw /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>ระบบจัดการพัสดุ</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.id} 
              className={activeTab === item.id ? 'active' : ''}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;