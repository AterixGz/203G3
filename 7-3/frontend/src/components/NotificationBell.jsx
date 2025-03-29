import React, { useState, useEffect } from 'react';
import { Bell, Package, ShoppingCart, AlertCircle } from 'react-feather';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      icon: <ShoppingCart size={16} />,
      message: 'มีการสั่งซื้อใหม่ #1234',
      time: '2 นาทีที่แล้ว',
      unread: true
    },
    {
      id: 2,
      icon: <Package size={16} />,
      message: 'สินค้าใกล้หมด: Item A',
      time: '5 นาทีที่แล้ว',
      unread: true
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-bell">
      <button 
        className="notification-button"
        onClick={toggleNotifications}
      >
        <Bell size={22} />  {/* Increased from 18 */}
        {notifications.filter(n => n.unread).length > 0 && (
          <span className="notification-badge">
            {notifications.filter(n => n.unread).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`notification-dropdown ${isAnimating ? 'show' : ''}`}>
          <div className="notification-header">
            <span className="notification-title">การแจ้งเตือน</span>
            <button className="text-sm text-blue-600">
              มาร์คว่าอ่านทั้งหมด
            </button>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.unread ? 'notification-unread' : ''}`}
                >
                  <div className="notification-content">
                    <div className="notification-icon">
                      {notification.icon}
                    </div>
                    <div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <AlertCircle size={24} />
                <p>ไม่มีการแจ้งเตือนใหม่</p>
              </div>
            )}
          </div>

          <div className="notification-footer">
            <button>ดูการแจ้งเตือนทั้งหมด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;