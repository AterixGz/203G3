"use client"

import { useState } from "react"

function InventoryReceiving() {
  const [selectedPO, setSelectedPO] = useState("")
  const [receiptNumber, setReceiptNumber] = useState("RCV-" + new Date().getTime().toString().slice(-6))
  const [items, setItems] = useState([])

  // Mock data for purchase orders
  const purchaseOrders = [
    { id: "PO001", supplier: "บริษัท เอบีซี จำกัด", date: "2023-10-25" },
    { id: "PO002", supplier: "บริษัท เอ็กซ์วาย จำกัด", date: "2023-10-28" },
  ]

  // Mock items for selected PO
  const poItems = {
    PO001: [
      { id: 1, name: "คอมพิวเตอร์", quantity: 5, received: 0 },
      { id: 2, name: "เมาส์", quantity: 10, received: 0 },
    ],
    PO002: [
      { id: 1, name: "โต๊ะทำงาน", quantity: 3, received: 0 },
      { id: 2, name: "เก้าอี้สำนักงาน", quantity: 6, received: 0 },
    ],
  }

  const handlePOSelect = (poId) => {
    setSelectedPO(poId)
    if (poId && poItems[poId]) {
      setItems(poItems[poId].map((item) => ({ ...item })))
    } else {
      setItems([])
    }
  }

  const handleQuantityChange = (id, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, received: value }
      }
      return item
    })
    setItems(updatedItems)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("บันทึกการรับพัสดุเรียบร้อยแล้ว")
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">การรับพัสดุเข้าคลัง</h2>
        <p className="card-description">บันทึกการรับพัสดุตามใบสั่งซื้อ</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="receipt-number">เลขที่ใบรับพัสดุ</label>
              <input id="receipt-number" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="receipt-date">วันที่รับ</label>
              <input id="receipt-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="form-group">
              <label htmlFor="po-select">อ้างอิงใบสั่งซื้อ</label>
              <select id="po-select" value={selectedPO} onChange={(e) => handlePOSelect(e.target.value)}>
                <option value="">เลือกใบสั่งซื้อ</option>
                {purchaseOrders.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.id} - {po.supplier}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="delivery-note">เลขที่ใบส่งของ</label>
              <input id="delivery-note" />
            </div>
          </div>

          {selectedPO && (
            <div className="items-section">
              <h3>รายการพัสดุ</h3>

              <table>
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จำนวนสั่งซื้อ</th>
                    <th>จำนวนรับ</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <input
                          type="number"
                          value={item.received}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          max={item.quantity}
                        />
                      </td>
                      <td>
                        {item.received === item.quantity ? (
                          <span className="status-complete">
                            <span className="icon">✓</span> ครบถ้วน
                          </span>
                        ) : item.received > 0 ? (
                          <span className="status-partial">บางส่วน</span>
                        ) : (
                          <span className="status-pending">ยังไม่รับ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>
      <div className="card-footer">
        <button className="btn-outline">ยกเลิก</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={!selectedPO || items.length === 0}>
          บันทึกการรับพัสดุ
        </button>
      </div>
    </div>
  )
}

export default InventoryReceiving

