"use client";

import { useState, useEffect } from "react";

function AutoRequisition() {
  const [itemSettings, setItemSettings] = useState([]); // เก็บข้อมูลพัสดุจากฐานข้อมูล
  const [requisitions, setRequisitions] = useState([]); // เก็บข้อมูลใบขอซื้อ
  const [showSettings, setShowSettings] = useState(false);

  // ดึงข้อมูลพัสดุจาก API เมื่อโหลดหน้า
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/inventory-items");
        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลพัสดุ");
        }
        const data = await response.json();
        setItemSettings(data); // ตั้งค่าข้อมูลพัสดุจากฐานข้อมูล
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        alert("ไม่สามารถดึงข้อมูลพัสดุได้");
      }
    };

    fetchInventoryItems();
  }, []);

  // ฟังก์ชันตรวจสอบระดับสินค้าคงเหลือและสร้างใบขอซื้อ
  const checkInventoryLevels = () => {
    const belowThresholdItems = itemSettings.filter(
      (item) => item.autoReorder && item.received_quantity < item.minThreshold
    );

    if (belowThresholdItems.length > 0) {
      const newRequisitionId = `PR-AUTO-${(requisitions.length + 1).toString().padStart(3, "0")}`;
      const today = new Date().toISOString().split("T")[0];

      const newRequisition = {
        id: newRequisitionId,
        date: today,
        status: "รออนุมัติ",
        items: belowThresholdItems.map((item) => ({
          itemId: item.id,
          code: item.item_id,
          name: item.name,
          quantity: item.minThreshold - item.received_quantity,
          unit_price: item.unit_price,
        })),
      };

      setRequisitions([newRequisition, ...requisitions]);
      alert(`สร้างใบขอซื้ออัตโนมัติ ${newRequisitionId} สำหรับพัสดุที่ต่ำกว่าพิกัด`);
    } else {
      alert("ไม่มีพัสดุที่ต่ำกว่าพิกัดขั้นต่ำ");
    }
  };

  // Toggle auto-reorder สำหรับพัสดุ
  const toggleAutoReorder = (id) => {
    setItemSettings(
      itemSettings.map((item) =>
        item.id === id ? { ...item, autoReorder: !item.autoReorder } : item
      )
    );
  };

  // อัปเดตพิกัดขั้นต่ำสำหรับพัสดุ
  const updateMinThreshold = (id, value) => {
    setItemSettings(
      itemSettings.map((item) =>
        item.id === id ? { ...item, minThreshold: value } : item
      )
    );
  };

  // คำนวณมูลค่ารวมของใบขอซื้อ
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  return (
    <>
      <div className="card-header">
        <div className="header-content">
          <div>
            <h2 className="card-title">การจัดทำใบขอซื้ออัตโนมัติ</h2>
            <p className="card-description">
              ระบบสร้างใบขอซื้อโดยอัตโนมัติเมื่อพัสดุต่ำกว่าพิกัดขั้นต่ำ
            </p>
          </div>
          <div className="header-actions">
            <button
              key="settings-button"
              className="btn-outline"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "ดูใบขอซื้ออัตโนมัติ" : "ตั้งค่าพิกัดขั้นต่ำ"}
            </button>
            <button className="btn-primary" onClick={checkInventoryLevels}>
              <span className="icon">↻</span> ตรวจสอบพัสดุ
            </button>
          </div>
        </div>
      </div>
      <div className="content-section">
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
                  {itemSettings.map((item) => (
                    <tr key={item.id}>
                      <td>{item.item_id}</td>
                      <td>{item.name}</td>
                      <td>{item.received_quantity} ชิ้น</td>
                      <td>
                        <input
                          type="number"
                          value={item.minThreshold || 0}
                          onChange={(e) => updateMinThreshold(item.id, Number(e.target.value))}
                          min={1}
                          className="input-small"
                        />
                      </td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item.autoReorder || false}
                            onChange={() => toggleAutoReorder(item.id)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td>
                        {item.received_quantity < item.minThreshold ? (
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
                  {requisitions.map((req) => (
                    <div key={req.id} className="requisition-card">
                      <div className="requisition-header">
                        <div>
                          <h4 className="requisition-title">ใบขอซื้อเลขที่: {req.id}</h4>
                          <p className="requisition-date">วันที่: {req.date}</p>
                        </div>
                        <span
                          className={`status-badge ${
                            req.status === "อนุมัติแล้ว" ? "status-approved" : "status-pending"
                          }`}
                        >
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
                            {req.items.map((item) => (
                              <tr key={item.itemId}>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit_price ? item.unit_price.toLocaleString() : "0"} บาท</td>
                                <td>
                                  {item.unit_price && item.quantity
                                    ? (item.quantity * item.unit_price).toLocaleString()
                                    : "0"}{" "}
                                  บาท
                                </td>
                              </tr>
                            ))}
                            <tr className="total-row">
                              <td colSpan={4} className="text-right">
                                รวมทั้งสิ้น
                              </td>
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
                <div className="empty-state">ไม่มีใบขอซื้ออัตโนมัติ</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AutoRequisition;