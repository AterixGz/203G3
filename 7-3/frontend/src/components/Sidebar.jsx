"use client"
import { useState } from "react"
import { ShoppingCart, Package, DollarSign, LogOut, RefreshCw, User, Edit, LogOut as LogOutIcon, CheckSquare, List as ListIcon } from "react-feather"

function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const [showDropup, setShowDropup] = useState(false)

  // Base menu items for all roles
  const baseMenuItems = [
    { id: "purchase-order", label: "ใบสั่งซื้อ", icon: <ShoppingCart size={18} /> },
    { id: "receiving", label: "รับพัสดุเข้าคลัง", icon: <Package size={18} /> },
    { id: "unit-cost", label: "ต้นทุนต่อหน่วย", icon: <DollarSign size={18} /> },
    { id: "disbursement", label: "เบิกจ่ายพัสดุ", icon: <LogOut size={18} /> },
    { id: "auto-requisition", label: "ขอซื้ออัตโนมัติ", icon: <RefreshCw size={18} /> },
  ]

  // Add management-specific menu items
  const getMenuItems = () => {
    if (user?.role === 'management') {
      return [
        ...baseMenuItems,
        { id: "approve", label: "รายการรออนุมัติ", icon: <CheckSquare size={18} /> },
        { id: "list", label: "รายการที่อนุมัติแล้ว", icon: <ListIcon size={18} /> }
      ]
    }
    return baseMenuItems
  }

  const menuItems = getMenuItems()

  const handleProfileClick = () => {
    setShowDropup(!showDropup)
  }

  const handleClickOutside = () => {
    if (showDropup) {
      setShowDropup(false)
    }
  }

  // Get role display name
  const getRoleDisplay = (role) => {
    const roles = {
      admin: 'Administrator',
      purchasing: 'ฝ่ายจัดซื้อ',
      finance: 'ฝ่ายการเงิน',
      management: 'ฝ่ายบริหาร'
    }
    return roles[role] || role
  }

  return (
    <div className="sidebar" onClick={handleClickOutside}>
      <div className="sidebar-header">
        <h2>ระบบจัดการพัสดุ</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => setActiveTab(item.id)}>
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="user-section">
        <div className="user-container" onClick={(e) => {
          e.stopPropagation();
          handleProfileClick();
        }}>
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{getRoleDisplay(user?.role)}</div>
          </div>
        </div>
        {showDropup && (
          <div className="user-dropup">
            <div className="dropup-item" onClick={() => console.log('Edit profile')}>
              <Edit size={14} />
              <span>แก้ไขโปรไฟล์</span>
            </div>
            <div className="dropup-item" onClick={onLogout}>
              <LogOutIcon size={14} />
              <span>ออกจากระบบ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar

