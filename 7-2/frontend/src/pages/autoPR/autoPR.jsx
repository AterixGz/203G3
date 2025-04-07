import { useState, useEffect } from 'react';
import './autoPR.css';

const AutoPR = () => {
  const [items, setItems] = useState([]);
  const [autoOrderSettings, setAutoOrderSettings] = useState({});
  const [costItems, setCostItems] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch items and cost data when component mounts
  useEffect(() => {
    fetchItems();
    fetchCostItems();
    loadSettings();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('autoOrderSettings', JSON.stringify(autoOrderSettings));
  }, [autoOrderSettings]);

  // Load saved settings from localStorage
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('autoOrderSettings');
    if (savedSettings) {
      setAutoOrderSettings(JSON.parse(savedSettings));
    }
  };

  // Fetch items from inventory
  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/inventory-items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Fetch cost items
  const fetchCostItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/cost-items');
      const data = await response.json();
      // Convert array to object with item name as key for easier lookup
      const costMap = data.reduce((acc, item) => {
        acc[item.name] = item.unitPrice;
        return acc;
      }, {});
      setCostItems(costMap);
    } catch (error) {
      console.error('Error fetching cost items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle auto order for an item
  const toggleAutoOrder = (itemId) => {
    setAutoOrderSettings(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        enabled: !prev[itemId]?.enabled
      }
    }));
  };

  // Update minimum threshold for an item
  const updateMinThreshold = (itemId, value) => {
    setAutoOrderSettings(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        minThreshold: parseInt(value)
      }
    }));
  };

  // Create PR for items below threshold
  const createAutoPR = async (belowThresholdItems) => {
    const prNumber = `PR-AUTO-${new Date().getTime().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    const prData = {
      prNumber,
      date: today,
      requester: "ระบบอัตโนมัติ",
      department: "ระบบ",
      purpose: "สั่งซื้ออัตโนมัติเนื่องจากสินค้าต่ำกว่าพิกัด",
      items: belowThresholdItems.map(item => ({
        name: item.name,
        quantity: item.minThreshold - item.quantity,
        unit: item.unit,
        price: costItems[item.name] || 0
      })),
      note: "สร้างโดยระบบอัตโนมัติ",
      status: "pending"
    };

    try {
      const response = await fetch('http://localhost:3000/api/pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prData)
      });

      if (!response.ok) {
        throw new Error('Failed to create PR');
      }

      alert(`สร้างใบขอซื้ออัตโนมัติ ${prNumber} สำเร็จ`);
    } catch (error) {
      console.error('Error creating PR:', error);
      alert('เกิดข้อผิดพลาดในการสร้างใบขอซื้อ');
    }
  };

  // Check inventory levels
  const checkInventoryLevels = () => {
    const belowThresholdItems = items.filter(item => {
      const settings = autoOrderSettings[item.id];
      return settings?.enabled && 
             settings?.minThreshold && 
             item.quantity < settings.minThreshold;
    });

    if (belowThresholdItems.length > 0) {
      createAutoPR(belowThresholdItems);
    } else {
      alert('ไม่มีสินค้าที่ต่ำกว่าพิกัดขั้นต่ำ');
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="auto-pr-container">
      <div className="auto-pr-header">
        <h2>ตั้งค่าการขอซื้ออัตโนมัติ</h2>
        <button onClick={checkInventoryLevels} className="check-button">
          ตรวจสอบสินค้า
        </button>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>สินค้า</th>
            <th>จำนวนคงเหลือ</th>
            <th>พิกัดขั้นต่ำ</th>
            <th>ราคาต่อหน่วย</th>
            <th>สถานะ</th>
            <th>เปิดใช้งาน</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={autoOrderSettings[item.id]?.minThreshold || 0}
                  onChange={(e) => updateMinThreshold(item.id, e.target.value)}
                  className="threshold-input"
                />
              </td>
              <td>{costItems[item.name]?.toLocaleString('th-TH') || 0} บาท</td>
              <td>
                <span className={`status ${
                  item.quantity < (autoOrderSettings[item.id]?.minThreshold || 0) 
                    ? 'below' 
                    : 'normal'
                }`}>
                  {item.quantity < (autoOrderSettings[item.id]?.minThreshold || 0)
                    ? 'ต่ำกว่าพิกัด'
                    : 'ปกติ'}
                </span>
              </td>
              <td>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={autoOrderSettings[item.id]?.enabled || false}
                    onChange={() => toggleAutoOrder(item.id)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AutoPR;