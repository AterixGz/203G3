// components/AutoRequisition.jsx
import React, { useState } from 'react';

function AutoRequisition() {
  // Mock inventory data with minimum thresholds
  const inventoryItems = [
    { id: 1, code: "IT001", name: "คอมพิวเตอร์", available: 2, minThreshold: 5, unitCost: 25000, autoReorder: true },
    { id: 2, code: "IT002", name: "เมาส์", available: 3, minThreshold: 10, unitCost: 500, autoReorder: true },
    { id: 3, code: "IT003", name: "คีย์บอร์ด", available: 25, minThreshold: 10, unitCost: 890, autoReorder: true },
    { id: 4, code: "OF001", name: "โต๊ะทำงาน", available: 1, minThreshold: 3, unitCost: 4500, autoReorder: true },
    { id: 5, code: "OF002", name: "เก้าอี้สำนักงาน", available: 12, minThreshold: 5, unitCost: 2200, autoReorder: false },
  ];

  // Mock auto-generated requisitions
  const initialRequisitions = [
    { 
      id: "PR-AUTO-001", 
      date: "2023-11-01", 
      status: "รออนุมัติ", 
      items: [
        { itemId: 1, code: "IT001", name: "คอมพิวเตอร์", quantity: 5, unitCost: 25000 }
      ]
    },
    { 
      id: "PR-AUTO-002", 
      date: "2023-11-02", 
      status: "อนุมัติแล้ว", 
      items: [
        { itemId: 2, code: "IT002", name: "เมาส์", quantity: 10, unitCost: 500 }
      ]
    }
  ];

  const [requisitions, setRequisitions] = useState(initialRequisitions);
  const [itemSettings, setItemSettings] = useState(inventoryItems);
  const [showSettings, setShowSettings] = useState(false);
  
  // Function to check inventory levels and generate requisitions
  const checkInventoryLevels = () => {
    const belowThresholdItems = itemSettings.filter(
      item => item.autoReorder && item.available < item.minThreshold
    );
    
    if (belowThresholdItems.length > 0) {
      const newRequisitionId = `PR-AUTO-${(requisitions.length + 1).toString().padStart(3, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      
      const newRequisition = {
        id: newRequisitionId,
        date: today,
        status: "รออนุมัติ",
        items: belowThresholdItems.map(item => ({
          itemId: item.id,
          code: item.code,
          name: item.name,
          quantity: item.minThreshold - item.available,
          unitCost: item.unitCost
        }))
      };
      
      setRequisitions([newRequisition, ...requisitions]);
      alert(`สร้างใบขอซื้ออัตโนมัติ ${newRequisitionId} สำหรับพัสดุที่ต่ำกว่าพิกัด`);
    } else {
      alert("ไม่มีพัสดุที่ต่ำกว่าพิกัดขั้นต่ำ");
    }
  };
  
  // Toggle auto-reorder for an item
  const toggleAutoReorder = (id) => {
    setItemSettings(itemSettings.map(item => 
      item.id === id ? { ...item, autoReorder: !item.autoReorder } : item
    ));
  };
  
  // Update minimum threshold for an item
  const updateMinThreshold = (id, value) => {
    setItemSettings(itemSettings.map(item => 
      item.id === id ? { ...item, minThreshold: value } : item
    ));
  };
  
  // Calculate total value of a requisition
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="header-content">
          <div>
            <h2 className="card-title">การจัดทำใบขอซื้ออัตโนมัติ</h2>
            <p className="card-description">ระบบสร้างใบขอซื้อโดยอัตโนมัติเมื่อพัสดุต่ำกว่าพิกัดขั้นต่ำ</p>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? "ดูใบขอซื้ออัตโนมัติ" : "ตั้งค่าพิกัดขั้นต่ำ"}
            </button>
            <button className="btn-primary" onClick={checkInventoryLevels}>
              <span className="icon">↻</span> ตรวจสอบพัสดุ
            </button>
          </div>
        </div>
      </div>
      <div className="card-content">
        {showSettings ? (
          <div>
            <h3 className="section-title">ตั้งค่าพิกัดขั้นต่ำและการสั่งซื้ออัตโนมัติ</h3>
            
            <table>
              <thead>
                <tr>
                  <th>รหัสพัสดุ</th>
                  <th>รายการ</th>
                  <th>คงเหลือ</th>
                  <th>พิกัดขั้นต่ำ</th>
                  <th>สั่งซื้ออัตโนมัติ</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {itemSettings.map(item => (
                  <tr key={item.id}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.available}</td>
                    <td>
                      <input 
                        type="number" 
                        value={item.minThreshold} 
                        onChange={(e) => updateMinThreshold(item.id, Number(e.target.value))} 
                        min={1}
                        className="input-small"
                      />
                    </td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={item.autoReorder} 
                          onChange={() => toggleAutoReorder(item.id)} 
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>
                      {item.available < item.minThreshold ? (
                        <span className="status-error">
                          <span className="icon">⚠</span> ต่ำกว่าพิกัด
                        </span>
                      ) : (
                        <span className="status-ok">
                          <span className="icon">✓</span> ปกติ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h3 className="section-title">ใบขอซื้ออัตโนมัติ</h3>
            
            {requisitions.length > 0 ? (
              <div className="requisition-list">
                {requisitions.map(req => (
                  <div key={req.id} className="requisition-card">
                    <div className="requisition-header">
                      <div>
                        <h4 className="requisition-title">ใบขอซื้อเลขที่: {req.id}</h4>
                        <p className="requisition-date">วันที่: {req.date}</p>
                      </div>
                      <span className={`status-badge ${req.status === "อนุมัติแล้ว" ? "status-approved" : "status-pending"}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="requisition-content">
                      <table>
                        <thead>
                          <tr>
                            <th>รหัสพัสดุ</th>
                            <th>รายการ</th>
                            <th>จำนวน</th>
                            <th>ราคาต่อหน่วย</th>
                            <th>รวม</th>
                          </tr>
                        </thead>
                        <tbody>
                          {req.items.map(item => (
                            <tr key={item.itemId}>
                              <td>{item.code}</td>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>{item.unitCost.toLocaleString()} บาท</td>
                              <td>{(item.quantity * item.unitCost).toLocaleString()} บาท</td>
                            </tr>
                          ))}
                          <tr className="total-row">
                            <td colSpan={4} className="text-right">รวมทั้งสิ้น</td>
                            <td>{calculateTotal(req.items).toLocaleString()} บาท</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="requisition-footer">
                      {req.status === "รออนุมัติ" && (
                        <>
                          <button className="btn-outline btn-sm">แก้ไข</button>
                          <button className="btn-primary btn-sm">อนุมัติ</button>
                        </>
                      )}
                      {req.status === "อนุมัติแล้ว" && (
                        <button className="btn-outline btn-sm">สร้างใบสั่งซื้อ</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                ไม่มีใบขอซื้ออัตโนมัติ
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AutoRequisition;