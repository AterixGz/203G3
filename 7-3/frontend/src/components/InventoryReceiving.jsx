"use client"

import { useState, useEffect } from "react"

function InventoryReceiving() {
  const [selectedPO, setSelectedPO] = useState("")
  const [receiptNumber, setReceiptNumber] = useState("RCV-" + new Date().getTime().toString().slice(-6))
  const [items, setItems] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])

  // โหลดข้อมูลใบสั่งซื้อจากเซิร์ฟเวอร์
  useEffect(() => {
    fetch("http://localhost:3000/purchase-orders")
      .then((res) => res.json())
      .then((data) => setPurchaseOrders(data))
      .catch((err) => console.error("Error fetching purchase orders:", err))
  }, [])

  // โหลดข้อมูลรายการสินค้าจากใบสั่งซื้อที่เลือก
  const handlePOSelect = (poId) => {
    setSelectedPO(poId)
    if (!poId) {
      setItems([])
      return
    }

    fetch(`http://localhost:3000/purchase-items/${poId}`)
      .then((res) => res.json())
      .then((data) => setItems(data.map((item) => ({ ...item, received: 0 }))))
      .catch((err) => console.error("Error fetching purchase items:", err))
  }

  const handleQuantityChange = (id, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, received: value } : item))
  }

  // ตรวจสอบว่าได้กรอกจำนวนรับครบถ้วนทุกรายการหรือไม่
  const isAllItemsReceived = items.every(item => item.received === item.quantity)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAllItemsReceived) {
      alert("กรุณากรอกจำนวนรับให้ครบถ้วนก่อน")
      return
    }

    const receivingData = {
      receiptNumber,
      date: document.getElementById("receipt-date").value,
      deliveryNote: document.getElementById("delivery-note").value,
      selectedPO,
      items,
    }

    try {
      const response = await fetch("http://localhost:3000/inventory-receiving", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receivingData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)

        // บันทึกข้อมูลลงใน inventory_items
        const inventoryItemsData = items.map(item => ({
          item_id: item.id,
          po_id: selectedPO,
          received_quantity: item.received,
          total: item.unit_price * item.received,
        }))
        await fetch("http://localhost:3000/inventory-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryItemsData),
        })

        alert("ข้อมูลการรับพัสดุและสินค้าเข้าสู่คลังสำเร็จ")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
    }
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
                    {po.po_number} - {po.supplier_name}
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
                  <tr>
                    <td colSpan="4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>
      <div className="card-footer">
        <button className="btn-outline">ยกเลิก</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={!selectedPO || items.length === 0 || !isAllItemsReceived}>
          บันทึกการรับพัสดุ
        </button>
      </div>
    </div>
  )
}

export default InventoryReceiving
