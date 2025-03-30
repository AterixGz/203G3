"use client"

import { useState } from "react"

function PurchaseOrder() {
  const [poNumber, setPoNumber] = useState("PO-" + new Date().getTime().toString().slice(-6))
  const [selectedPR, setSelectedPR] = useState("")
  const [items, setItems] = useState([{ id: 1, name: "", quantity: 0, unitPrice: 0, total: 0 }])

  // Mock data for purchase requests
  const purchaseRequests = [
    { id: "PR001", date: "2023-10-15", department: "IT" },
    { id: "PR002", date: "2023-10-18", department: "HR" },
    { id: "PR003", date: "2023-10-20", department: "Finance" },
  ]

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    })
    setItems(updatedItems)
  }

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1
    setItems([...items, { id: newId, name: "", quantity: 0, unitPrice: 0, total: 0 }])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
  
    const orderData = {
      poNumber,
      date: new Date().toISOString().split("T")[0],
      supplier: document.getElementById("supplier").value,
      selectedPR,
      items,
      total: calculateTotal(),
    };
  
    try {
      const response = await fetch("http://localhost:3000/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // แจ้งเตือนว่าบันทึกสำเร็จ
      } 
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };
  

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">จัดทำใบสั่งซื้อ (Purchase Order)</h2>
        <p className="card-description">สร้างใบสั่งซื้อโดยใช้ข้อมูลจากใบขอซื้อ</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="po-number">เลขที่ใบสั่งซื้อ</label>
              <input id="po-number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="po-date">วันที่</label>
              <input id="po-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="form-group">
              <label htmlFor="pr-select">อ้างอิงใบขอซื้อ</label>
              <select id="pr-select" value={selectedPR} onChange={(e) => setSelectedPR(e.target.value)}>
                <option value="">เลือกใบขอซื้อ</option>
                {purchaseRequests.map((pr) => (
                  <option key={pr.id} value={pr.id}>
                    {pr.id} - {pr.date} ({pr.department})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="supplier">ผู้จำหน่าย</label>
              <input id="supplier" />
            </div>
          </div>

          <div className="items-section">
            <div className="section-header">
              <h3>รายการสินค้า</h3>
              <button type="button" className="btn-outline" onClick={addItem}>
                <span className="icon">+</span> เพิ่มรายการ
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>จำนวน</th>
                  <th>ราคาต่อหน่วย</th>
                  <th>รวม</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input value={item.name} onChange={(e) => handleItemChange(item.id, "name", e.target.value)} />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                      />
                    </td>
                    <td>{item.total.toFixed(2)}</td>
                    <td>
                      <button type="button" className="btn-icon" onClick={() => removeItem(item.id)}>
                        <span className="icon">×</span>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={3} className="text-right">
                    รวมทั้งสิ้น
                  </td>
                  <td>{calculateTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>
      <div className="card-footer">
        <button className="btn-outline">ยกเลิก</button>
        <button className="btn-primary" onClick={handleSubmit}>
          บันทึกใบสั่งซื้อ
        </button>
      </div>
    </div>
  )
}

export default PurchaseOrder

