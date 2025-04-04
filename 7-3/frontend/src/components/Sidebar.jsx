"use client"
import { useState } from "react"
import { ShoppingCart, Package, DollarSign, LogOut, RefreshCw, User, Edit, LogOut as LogOutIcon, CheckSquare, List as ListIcon, Settings } from "react-feather"

function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const [showDropup, setShowDropup] = useState(false)

  // Define base menu items for purchasing
  const purchasingBaseItems = [
    { id: "receiving", label: "รับพัสดุเข้าคลัง", icon: <Package size={18} /> },
    { id: "disbursement", label: "เบิกจ่ายพัสดุ", icon: <LogOut size={18} /> },
  ]

  // Define items that only appear for certain roles
  const commonItems = [
    { id: "unit-cost", label: "ต้นทุนต่อหน่วย", icon: <DollarSign size={18} /> },
  ]

  // Update getPurchasingMenuItems function to include purchase order
  const getPurchasingMenuItems = () => [
    ...purchasingBaseItems,
    { id: "purchase-order", label: "ใบสั่งซื้อ", icon: <ShoppingCart size={18} /> },
    { id: "approve", label: "รายการรออนุมัติ", icon: <CheckSquare size={18} /> },
    { id: "auto-requisition", label: "ขอซื้ออัตโนมัติ", icon: <RefreshCw size={18} /> },
    { id: "status", label: "สถานะคำสั่งซื้อ", icon: <ListIcon size={18} /> }
  ]

  // Update getFinanceMenuItems function to remove receiving and disbursement
  const getFinanceMenuItems = () => [
    ...commonItems,
    { id: "approve", label: "รายการรออนุมัติ", icon: <CheckSquare size={18} /> },
    { id: "status", label: "สถานะคำสั่งซื้อ", icon: <ListIcon size={18} /> }
  ]

  // Update getManagementMenuItems function to remove purchasingBaseItems
  const getManagementMenuItems = () => [
    ...commonItems,
    { id: "approve", label: "รายการรออนุมัติ", icon: <CheckSquare size={18} /> },
    { id: "status", label: "สถานะคำสั่งซื้อ", icon: <ListIcon size={18} /> }
  ]

  // Update getAdminMenuItems function
  const getAdminMenuItems = () => [
    { id: "role-setting", label: "จัดการสิทธิ์", icon: <Settings size={18} /> }
  ]

  // Get menu items based on user role
  const getMenuItems = () => {
    switch (user?.role) {
      case 'purchasing':
        return getPurchasingMenuItems()
      case 'management':
        return getManagementMenuItems()
      case 'finance':
        return getFinanceMenuItems()
      case 'admin':
        return getAdminMenuItems()
      default:
        return [...purchasingBaseItems, ...commonItems]
    }
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

