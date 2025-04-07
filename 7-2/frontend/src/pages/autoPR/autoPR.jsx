import { useState, useEffect } from 'react';
import './autoPR.css';

const AutoPR = () => {
  const [items, setItems] = useState([]);
  const [autoOrderSettings, setAutoOrderSettings] = useState({});
  const [pendingPRs, setPendingPRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch items and pending PRs when component mounts
  useEffect(() => {
    fetchItems();
    fetchPendingPRs();
    loadSettings();
  }, []);

  // Load saved settings from API
  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/auto-settings');
      const data = await response.json();
      setAutoOrderSettings(data.settings || {});
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Fetch pending PRs
  const fetchPendingPRs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pr');
      const data = await response.json();
      // Filter only pending PRs created by system
      setPendingPRs(data.filter(pr => 
        pr.status === 'pending' && 
        pr.requester === 'ระบบอัตโนมัติ'
      ));
    } catch (error) {
      console.error('Error fetching pending PRs:', error);
    }
  };

  // Calculate effective quantity (current + pending PR quantities)
  const calculateEffectiveQuantity = (item) => {
    const pendingQuantity = pendingPRs.reduce((total, pr) => {
      const matchingItem = pr.items.find(i => i.name === item.name);
      return total + (matchingItem ? Number(matchingItem.quantity) : 0);
    }, 0);
    return Number(item.quantity) + pendingQuantity;
  };

  // Fetch items from inventory
  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/inventory-items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle auto order for an item
  const toggleAutoOrder = async (itemId) => {
    const newSettings = {
      ...autoOrderSettings,
      [itemId]: {
        ...autoOrderSettings[itemId],
        enabled: !autoOrderSettings[itemId]?.enabled
      }
    };
    setAutoOrderSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Update minimum threshold for an item
  const updateMinThreshold = async (itemId, value) => {
    const newSettings = {
      ...autoOrderSettings,
      [itemId]: {
        ...autoOrderSettings[itemId],
        minThreshold: parseInt(value || 0)
      }
    };
    setAutoOrderSettings(newSettings);
  };

  // Update maximum threshold
  const updateMaxThreshold = async (itemId, value) => {
    const newSettings = {
      ...autoOrderSettings,
      [itemId]: {
        ...autoOrderSettings[itemId],
        maxThreshold: parseInt(value || 0)
      }
    };
    setAutoOrderSettings(newSettings);
  };

  // Update purchase quantity
  const updatePurchaseQuantity = async (itemId, value) => {
    const newSettings = {
      ...autoOrderSettings,
      [itemId]: {
        ...autoOrderSettings[itemId],
        purchaseQuantity: parseInt(value || 0)
      }
    };
    setAutoOrderSettings(newSettings);
  };

  // Calculate number of orders needed to reach minimum threshold
  const calculateOrderQuantity = (currentQuantity, minThreshold, purchaseQuantity) => {
    if (!purchaseQuantity) return minThreshold - currentQuantity;
    
    const deficit = minThreshold - currentQuantity;
    if (deficit <= 0) return 0;
    
    // Calculate how many purchase cycles needed to reach minimum
    const cycles = Math.ceil(deficit / purchaseQuantity);
    return cycles * purchaseQuantity;
  };

  // Modify createAutoPR function
  const createAutoPR = async (belowThresholdItems) => {
    const prNumber = `PR-AUTO-${new Date().getTime().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    const prData = {
      prNumber,
      date: today,
      requester: "ระบบอัตโนมัติ",
      department: "ระบบ",
      purpose: "สั่งซื้ออัตโนมัติเนื่องจากสินค้าต่ำกว่าพิกัด",
      items: belowThresholdItems.map(item => {
        const orderQty = calculateOrderQuantity(
          calculateEffectiveQuantity(item),
          autoOrderSettings[item.id].minThreshold,
          autoOrderSettings[item.id].purchaseQuantity
        );
        return {
          name: item.name,
          quantity: orderQty.toString(),
          unit: item.unit || 'ชิ้น',
          price: item.unitPrice
        };
      }),
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
      fetchPendingPRs(); // Refresh pending PRs list
    } catch (error) {
      console.error('Error creating PR:', error);
      alert('เกิดข้อผิดพลาดในการสร้างใบขอซื้อ');
    }
  };

  // Modify checkInventoryLevels function
  const checkInventoryLevels = () => {
    const belowThresholdItems = items.filter(item => {
      const settings = autoOrderSettings[item.id];
      const effectiveQuantity = calculateEffectiveQuantity(item);
      
      if (!settings?.enabled || !settings?.minThreshold) {
        return false;
      }

      return effectiveQuantity < settings.minThreshold;
    });

    if (belowThresholdItems.length > 0) {
      createAutoPR(belowThresholdItems);
    } else {
      alert('ไม่มีสินค้าที่ต่ำกว่าพิกัดขั้นต่ำ หรือมีการสั่งซื้อที่รออนุมัติอยู่แล้ว');
    }
  };

  // Add automatic check effect
  useEffect(() => {
    const checkEnabled = async () => {
      try {
        const enabledItems = items.filter(item => {
          const settings = autoOrderSettings[item.id];
          const effectiveQuantity = calculateEffectiveQuantity(item);
          return settings?.enabled && 
                 settings?.minThreshold && 
                 effectiveQuantity < settings.minThreshold;
        });

        if (enabledItems.length > 0) {
          const itemsToOrder = enabledItems.map(item => ({
            ...item,
            orderQuantity: autoOrderSettings[item.id].purchaseQuantity || 
                          (autoOrderSettings[item.id].minThreshold - calculateEffectiveQuantity(item))
          }));
          await createAutoPR(itemsToOrder);
        }
      } catch (error) {
        console.error('Error checking inventory:', error);
      }
    };

    // Check immediately when settings or items change
    if (!loading) {
      checkEnabled();
    }

    // Then check every 5 minutes
    const interval = setInterval(checkEnabled, 300000);
    return () => clearInterval(interval);
  }, [items, autoOrderSettings, loading]);

  // Update saveSettings function
  const saveSettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:3000/auto-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: newSettings })
      });
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    }
  };

  // Add edit and save functions
  const handleEdit = (itemId) => {
    setEditingId(itemId);
  };

  const handleSave = async (itemId) => {
    try {
      await saveSettings(autoOrderSettings);
      setEditingId(null);
      alert('บันทึกการตั้งค่าสำเร็จ');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    }
  };

  return (
    <div className="auto-pr-container">
      <div className="auto-pr-header">
        <h2>ตั้งค่าการขอซื้ออัตโนมัติ</h2>
      </div>
      <table className="auto-pr-table">
        <thead>
          <tr>
            <th>ชื่อสินค้า</th>
            <th>จำนวนในคลัง</th>
            <th>จำนวนที่รออนุมัติ</th>
            <th>จำนวนรวม</th>
            <th>พิกัดขั้นต่ำ</th>
            <th>พิกัดสูงสุด</th>
            <th>จำนวนสั่งซื้อ</th>
            <th>ราคาต่อหน่วย</th>
            <th>สถานะ</th>
            <th>เปิด/ปิด</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const settings = autoOrderSettings[item.id] || {};
            const effectiveQuantity = calculateEffectiveQuantity(item);
            const pendingQuantity = pendingPRs.reduce((total, pr) => {
              const matchingItem = pr.items.find(i => i.name === item.name);
              return total + (matchingItem ? Number(matchingItem.quantity) : 0);
            }, 0);
            const isEditing = editingId === item.id;

            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{pendingQuantity > 0 ? pendingQuantity : 0}</td>
                <td>{effectiveQuantity}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={settings.minThreshold || 0}
                      onChange={(e) => updateMinThreshold(item.id, e.target.value)}
                      className="threshold-input"
                    />
                  ) : (
                    settings.minThreshold || 0
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={settings.maxThreshold || 0}
                      onChange={(e) => updateMaxThreshold(item.id, e.target.value)}
                      className="threshold-input"
                    />
                  ) : (
                    settings.maxThreshold || 0
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={settings.purchaseQuantity || 0}
                      onChange={(e) => updatePurchaseQuantity(item.id, e.target.value)}
                      className="threshold-input"
                    />
                  ) : (
                    settings.purchaseQuantity || 0
                  )}
                </td>
                <td>{Number(item.unitPrice).toLocaleString('th-TH')} บาท</td>
                <td>
                  <span className={`status ${
                    Number(item.quantity) < (settings.minThreshold || 0)
                      ? 'below'
                      : Number(item.quantity) > (settings.maxThreshold || 0)
                      ? 'above'
                      : 'normal'
                  }`}>
                    {Number(item.quantity) < (settings.minThreshold || 0)
                      ? 'ต่ำกว่าพิกัด'
                      : Number(item.quantity) > (settings.maxThreshold || 0)
                      ? 'เกินพิกัด'
                      : 'ปกติ'}
                  </span>
                </td>
                <td>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.enabled || false}
                      onChange={() => toggleAutoOrder(item.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  {isEditing ? (
                    <button
                      onClick={() => handleSave(item.id)}
                      className="save-btn"
                    >
                      บันทึก
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="edit-btn"
                    >
                      แก้ไข
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AutoPR;